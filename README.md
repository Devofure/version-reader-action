# Devofure/version-reader-action

Get the version code, android version name and detailed version information


```yaml

inputs:
  gradlePath: "Gradle path to override version"
    required: true
    default: "app/build.gradle"
outputs:
  versionName:
  versionCode:
  majorVersion: 
  minorVersion: 
  patchVersion: 

  prereleaseVersion: 
  # Prerelease Stage, extracted from prereleaseVersion
  prereleaseStage:
  
  # Prerelease Build Number, extracted from prereleaseVersion
  buildMetaDataVersion: 
  prereleaseBuildNumber:
  buildMetaDataBuildNumber:
    description: "Build Meta Data Build Number, extracted from buildMetaDataVersion"
```
 
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
versionName: "1.1.2"
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
versionName "1.0.0-alpha.beta.1"
versionCode 4213

# outputs:
versionName: "1.0.0-alpha.beta.1"
versionCode: 4213
majorVersion: 1
minorVersion: 0
patchVersion: 0

prereleaseVersion: alpha.beta.1
prereleaseStage: alpha.beta
prereleaseBuildNumber: 1
```

```powershell
# build.gradle:
versionName "2.0.0-rc.21+beta.123"
versionCode 4213

# outputs:
versionName: "2.0.0-rc.21+beta.123"
versionCode: 4213
majorVersion: 2
minorVersion: 0
patchVersion: 0

prereleaseVersion: rc.21
prereleaseStage: rc
prereleaseBuildNumber: 21
buildMetaDataVersion: beta.123
buildMetaDataBuildNumber: 123
```
