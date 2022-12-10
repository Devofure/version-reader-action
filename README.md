# Devofure/version-reader-action

Get the version code, android version name and detailed version information

For more information about Semver version format -> https://semver.org/

### Simple Example:

```yaml
  - name: version reader
    id: versionReader
    uses: Devofure/version-reader-action@v1.0.1 
    # Default is app/build.gradle
```
Or
```yaml
  - name: version reader
    id: versionReader
    uses: Devofure/version-reader-action@v1.0.1
    with:
      gradlePath: app/build.gradle # Default is app/build.gradle
```


### outputs:
``` yaml
  cleanVersionName
  versionName
  versionCode
  majorVersion 
  minorVersion 
  patchVersion

  prereleaseVersion
  prereleaseStage
  prereleaseBuildNumber
  
  buildMetaDataVersion
  buildMetaDataType
  buildMetaDataBuildNumber
```

## Part of an example

``` yaml
jobs:
  build:
   runs-on: ubuntu-latest
   steps:

     - uses: actions/checkout@v2

     - name: version reader
       id: versionReader
       uses: Devofure/version-reader-action@v1.0.1
       
    # possible to use:
    # ${{ steps.versionReader.outputs.cleanVersionName }}
    # ${{ steps.versionReader.outputs.versionName }}
    # ${{ steps.versionReader.outputs.versionCode }}
    # ${{ steps.versionReader.outputs.majorVersion  }}
    # ${{ steps.versionReader.outputs.minorVersion  }}
    # ${{ steps.versionReader.outputs.patchVersion }}
    
    # ${{ steps.versionReader.outputs.prereleaseVersion }}
    # ${{ steps.versionReader.outputs.prereleaseStage }}
    # ${{ steps.versionReader.outputs.prereleaseBuildNumber }}
    
    # ${{ steps.versionReader.outputs.buildMetaDataVersion }}
    # ${{ steps.versionReader.outputs.buildMetaDataType }}
    # ${{ steps.versionReader.outputs.buildMetaDataBuildNumber }}    
    
```

## Versions in detail
 ```powershell
# Given versionCode 345
 345
 {versionCode}

# Given versionName 1.2.3-beta.543+debug.253
1.2.3-beta.543+debug.253
{1.2.3-beta.543+debug.253}
{versionName}

1.2.3-beta.543+debug.253
{1}.{2}.{3}-{beta.543}+{debug.253}
{majorVersion}.{minorVersion}.{patchVersion}-{prereleaseVersion}+{buildMetaDataVersion}


1.2.3-beta.543+debug.253
{1}.{2}.{3}-{beta}.{543}+{debug}.{253}
{majorVersion}.{minorVersion}.{patchVersion}-{prereleaseStage}.{prereleaseBuildNumber}+{buildMetaDataType}.{buildMetaDataBuildNumber}

```

## Some example of the version format supported
```powershell
# build.gradle:
versionName "1.2.3"
versionCode 1435

# outputs:
versionName: "1.2.3"
versionCode: 1435
majorVersion: 1
minorVersion: 2
patchVersion: 3
```

```powershell
# build.gradle:
versionName "2.0.1-alpha.1227"
versionCode 4213

# outputs:
versionName: "2.0.1-alpha.1227"
versionCode: 4213
majorVersion: 2
minorVersion: 0
patchVersion: 1

prereleaseVersion: alpha.1227
prereleaseStage: alpha
prereleaseBuildNumber: 1227
```

```powershell
# build.gradle:
versionName "1.1.2-prerelease+meta"
versionCode 1435

# outputs:
versionName: "1.1.2-prerelease+meta"
versionCode: 1435
majorVersion: 1
minorVersion: 1
patchVersion: 2

prereleaseVersion: prerelease
prereleaseStage: prerelease
buildMetaDataVersion: meta
```

```powershell
# build.gradle:
versionName "1.0.0-alpha.debug.1"
versionCode 4213

# outputs:
versionName: "1.0.0-alpha.debug.1"
versionCode: 4213
majorVersion: 1
minorVersion: 0
patchVersion: 0

prereleaseVersion: alpha.debug.1
prereleaseStage: alpha.debug
prereleaseBuildNumber: 1
```

```powershell
# build.gradle:
versionName "2.0.0-rc.21+debug.123"
versionCode 4213

# outputs:
versionName: "2.0.0-rc.21+debug.123"
versionCode: 4213
majorVersion: 2
minorVersion: 0
patchVersion: 0

prereleaseVersion: rc.21
prereleaseStage: rc
prereleaseBuildNumber: 21
buildMetaDataVersion: debug.123
buildMetaDataType: debug
buildMetaDataBuildNumber: 123
```
