import { expect } from "chai"
import { ethers } from "hardhat"
import { time } from "@nomicfoundation/hardhat-network-helpers"
import { deployProxy } from "../scripts/helpers/upgrades"
import type { B3TRFaucet, MockB3TR } from "../typechain-types"

const AMOUNT_PER_CLAIM = ethers.parseEther("100")
const MAX_CLAIMS_PER_DAY = 2n
const FUND_AMOUNT = ethers.parseEther("10000")

describe("B3TRFaucet", function () {
  let faucet: B3TRFaucet
  let token: MockB3TR
  let owner: any
  let alice: any
  let bob: any

  beforeEach(async function () {
    ;[owner, alice, bob] = await ethers.getSigners()

    const MockFactory = await ethers.getContractFactory("MockB3TR")
    token = (await MockFactory.deploy()) as unknown as MockB3TR
    await token.waitForDeployment()

    faucet = (await deployProxy("B3TRFaucet", [
      await token.getAddress(),
      AMOUNT_PER_CLAIM,
      MAX_CLAIMS_PER_DAY,
      owner.address,
    ])) as unknown as B3TRFaucet

    // Fund the faucet
    await token.mint(owner.address, FUND_AMOUNT)
    await token.connect(owner).approve(await faucet.getAddress(), FUND_AMOUNT)
    await faucet.connect(owner).fundFaucet(FUND_AMOUNT)
  })

  describe("initialize", function () {
    it("sets token, amounts, and owner", async function () {
      expect(await faucet.token()).to.equal(await token.getAddress())
      expect(await faucet.amountPerClaim()).to.equal(AMOUNT_PER_CLAIM)
      expect(await faucet.maxClaimsPerDay()).to.equal(MAX_CLAIMS_PER_DAY)
      expect(await faucet.owner()).to.equal(owner.address)
    })

    it("returns version 1", async function () {
      expect(await faucet.version()).to.equal("1")
    })
  })

  describe("claimTokens", function () {
    it("transfers tokens to the claimer", async function () {
      const before = await token.balanceOf(alice.address)
      await faucet.connect(alice).claimTokens()
      const after = await token.balanceOf(alice.address)
      expect(after - before).to.equal(AMOUNT_PER_CLAIM)
    })

    it("emits TokensClaimed", async function () {
      await expect(faucet.connect(alice).claimTokens())
        .to.emit(faucet, "TokensClaimed")
        .withArgs(alice.address, AMOUNT_PER_CLAIM)
    })

    it("allows up to maxClaimsPerDay per day", async function () {
      await faucet.connect(alice).claimTokens()
      await faucet.connect(alice).claimTokens()
      await expect(faucet.connect(alice).claimTokens()).to.be.revertedWith("Daily limit reached")
    })

    it("resets the counter after 1 day", async function () {
      await faucet.connect(alice).claimTokens()
      await faucet.connect(alice).claimTokens()
      await time.increase(24 * 60 * 60 + 1)
      await expect(faucet.connect(alice).claimTokens()).to.not.be.reverted
    })

    it("reverts when faucet is empty", async function () {
      // Drain by claiming with multiple users
      const richFaucet = (await deployProxy("B3TRFaucet", [
        await token.getAddress(),
        AMOUNT_PER_CLAIM,
        100n, // many claims allowed
        owner.address,
      ])) as unknown as B3TRFaucet

      await token.mint(owner.address, AMOUNT_PER_CLAIM)
      await token.connect(owner).approve(await richFaucet.getAddress(), AMOUNT_PER_CLAIM)
      await richFaucet.connect(owner).fundFaucet(AMOUNT_PER_CLAIM)

      await richFaucet.connect(alice).claimTokens() // drains it

      await expect(richFaucet.connect(bob).claimTokens()).to.be.revertedWith("Faucet empty")
    })
  })

  describe("canClaim / remainingClaimsForToday", function () {
    it("canClaim is true for fresh user", async function () {
      expect(await faucet.canClaim(alice.address)).to.equal(true)
    })

    it("remainingClaimsForToday decreases after each claim", async function () {
      expect(await faucet.remainingClaimsForToday(alice.address)).to.equal(MAX_CLAIMS_PER_DAY)
      await faucet.connect(alice).claimTokens()
      expect(await faucet.remainingClaimsForToday(alice.address)).to.equal(MAX_CLAIMS_PER_DAY - 1n)
    })

    it("canClaim is false after limit reached", async function () {
      await faucet.connect(alice).claimTokens()
      await faucet.connect(alice).claimTokens()
      expect(await faucet.canClaim(alice.address)).to.equal(false)
    })
  })

  describe("admin", function () {
    it("only owner can setAmountPerClaim", async function () {
      await expect(faucet.connect(alice).setAmountPerClaim(1n)).to.be.reverted
      await faucet.connect(owner).setAmountPerClaim(ethers.parseEther("50"))
      expect(await faucet.amountPerClaim()).to.equal(ethers.parseEther("50"))
    })

    it("only owner can setMaxClaimsPerDay", async function () {
      await expect(faucet.connect(alice).setMaxClaimsPerDay(5n)).to.be.reverted
      await faucet.connect(owner).setMaxClaimsPerDay(5n)
      expect(await faucet.maxClaimsPerDay()).to.equal(5n)
    })
  })

  describe("fundFaucet", function () {
    it("anyone can fund and event is emitted", async function () {
      const amount = ethers.parseEther("42")
      await token.mint(alice.address, amount)
      await token.connect(alice).approve(await faucet.getAddress(), amount)

      await expect(faucet.connect(alice).fundFaucet(amount))
        .to.emit(faucet, "FaucetFunded")
        .withArgs(alice.address, amount)

      expect(await token.balanceOf(await faucet.getAddress())).to.equal(FUND_AMOUNT + amount)
    })
  })
})
