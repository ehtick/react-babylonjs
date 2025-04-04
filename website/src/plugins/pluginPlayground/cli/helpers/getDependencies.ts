import path from 'node:path'

export const getPackageJsonDependencies = async () => {
  const packageFilePath = path.resolve(process.cwd(), 'package.json')
  const packageJson = await import(packageFilePath)

  return {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
    ...packageJson.peerDependencies,
  }
}

// always include peerDeps of react-babylonjs
const alwaysIncludedDeps = ['@babylonjs/core', '@babylonjs/gui']

/**
 * get dependencies for a specific demo, to avoid passing all deps to Sandbox  */
export const getDemoDependencies = (
  moduleImports: string[],
  packageJsonDependencies: Record<string, string>
) => {
  const depNames = Object.keys(packageJsonDependencies)
  const allImports = alwaysIncludedDeps.concat(moduleImports)

  const demoDependencies = allImports.reduce<Record<string, string>>((acc, importPath) => {
    if (packageJsonDependencies[importPath]) {
      acc[importPath] = packageJsonDependencies[importPath]

      return acc
    }

    const depName = depNames.find((name) => importPath.includes(name))

    if (depName) {
      acc[depName] = packageJsonDependencies[depName]
    } else {
      console.warn(`Couldn't resolve dependency for ${importPath}. Check the list of dependencies.`)
    }

    return acc
  }, {})

  return demoDependencies
}
