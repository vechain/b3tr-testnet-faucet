import { BaseContract, Interface } from "ethers"
import { ethers } from "hardhat"
import { getImplementationAddress } from "@openzeppelin/upgrades-core"

export type DeployUpgradeOptions = {
  versions?: (number | undefined)[]
  libraries?: ({ [libraryName: string]: string } | undefined)[]
  logOutput?: boolean
}

export type UpgradeOptions = {
  version?: number
  libraries?: { [libraryName: string]: string }
  logOutput?: boolean
}

export const deployProxy = async (
  contractName: string,
  args: any[],
  libraries: { [libraryName: string]: string } = {},
  version?: number,
  logOutput: boolean = false,
): Promise<BaseContract> => {
  const Contract = await ethers.getContractFactory(contractName, { libraries })
  const implementation = await Contract.deploy()
  await implementation.waitForDeployment()
  logOutput && console.log(`${contractName} impl.: ${await implementation.getAddress()}`)

  const proxyFactory = await ethers.getContractFactory("VeChainProxy")
  const proxy = await proxyFactory.deploy(
    await implementation.getAddress(),
    getInitializerData(Contract.interface, args, version),
  )
  await proxy.waitForDeployment()
  logOutput && console.log(`${contractName} proxy: ${await proxy.getAddress()}`)

  const newImplAddress = await getImplementationAddress(ethers.provider, await proxy.getAddress())
  const expectedAddress = await implementation.getAddress()
  if (newImplAddress.toLowerCase() !== expectedAddress.toLowerCase()) {
    throw new Error(`Implementation address mismatch: ${newImplAddress} !== ${expectedAddress}`)
  }

  return Contract.attach(await proxy.getAddress())
}

export const deployProxyOnly = async (
  contractName: string,
  libraries: { [libraryName: string]: string } = {},
  logOutput: boolean = false,
): Promise<string> => {
  const Contract = await ethers.getContractFactory(contractName, { libraries })
  const implementation = await Contract.deploy()
  await implementation.waitForDeployment()
  logOutput && console.log(`${contractName} impl.: ${await implementation.getAddress()}`)

  const proxyFactory = await ethers.getContractFactory("VeChainProxy")
  const proxy = await proxyFactory.deploy(await implementation.getAddress(), "0x")
  await proxy.waitForDeployment()
  logOutput && console.log(`${contractName} proxy: ${await proxy.getAddress()}`)

  const newImplAddress = await getImplementationAddress(ethers.provider, await proxy.getAddress())
  const expectedAddress = await implementation.getAddress()
  if (newImplAddress.toLowerCase() !== expectedAddress.toLowerCase()) {
    throw new Error(`Implementation address mismatch: ${newImplAddress} !== ${expectedAddress}`)
  }

  return await proxy.getAddress()
}

export const initializeProxy = async (
  proxyAddress: string,
  contractName: string,
  args: any[],
  libraries: { [libraryName: string]: string } = {},
  version?: number,
): Promise<BaseContract> => {
  const Contract = await ethers.getContractFactory(contractName, { libraries })
  const initializerData = getInitializerData(Contract.interface, args, version)

  const signer = (await ethers.getSigners())[0]
  const tx = await signer.sendTransaction({
    to: proxyAddress,
    data: initializerData,
    gasLimit: 10_000_000,
  })
  await tx.wait()

  return Contract.attach(proxyAddress)
}

export const upgradeProxy = async (
  previousVersionContractName: string,
  newVersionContractName: string,
  proxyAddress: string,
  args: any[] = [],
  options: UpgradeOptions,
): Promise<BaseContract> => {
  const Contract = await ethers.getContractFactory(newVersionContractName, {
    libraries: options.libraries,
  })
  const implementation = await Contract.deploy()
  await implementation.waitForDeployment()
  options.logOutput && console.log(`${newVersionContractName} impl.: ${await implementation.getAddress()}`)

  const currentContract = await ethers.getContractAt(previousVersionContractName, proxyAddress)

  const tx = await currentContract.upgradeToAndCall(
    await implementation.getAddress(),
    args.length > 0 ? getInitializerData(Contract.interface, args, options.version) : "0x",
  )
  await tx.wait()

  const newImplAddress = await getImplementationAddress(ethers.provider, proxyAddress)
  const expectedAddress = await implementation.getAddress()
  if (newImplAddress.toLowerCase() !== expectedAddress.toLowerCase()) {
    throw new Error(`Implementation address mismatch: ${newImplAddress} !== ${expectedAddress}`)
  }

  return Contract.attach(proxyAddress)
}

export const deployAndUpgrade = async (
  contractNames: string[],
  args: any[][],
  options: DeployUpgradeOptions,
): Promise<BaseContract> => {
  if (contractNames.length === 0) throw new Error("No contracts to deploy")
  if (contractNames.length !== args.length) throw new Error("Contract names and args must have the same length")

  let proxy = await deployProxy(
    contractNames[0],
    args[0],
    options.libraries?.[0],
    options.versions?.[0],
    options.logOutput,
  )

  for (let i = 1; i < contractNames.length; i++) {
    proxy = await upgradeProxy(
      contractNames[i - 1],
      contractNames[i],
      await proxy.getAddress(),
      args[i],
      { version: options.versions?.[i], libraries: options.libraries?.[i], logOutput: options.logOutput },
    )
  }

  return proxy
}

export function getInitializerData(contractInterface: Interface, args: any[], version?: number) {
  const initializer = version ? `initializeV${version}` : "initialize"
  const fragment = contractInterface.getFunction(initializer)
  if (!fragment) throw new Error(`Initializer "${initializer}" not found in contract ABI`)
  return contractInterface.encodeFunctionData(fragment, args)
}
