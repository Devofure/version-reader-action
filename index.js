const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

// versionCode — A positive integer [...] -> https://developer.android.com/studio/publish/versioning
const versionCodeRegexPattern = /(versionCode(?:\s|=)*)(.*)/;
const groupVersionCodeValueIndex = 2

// versionName — A string used as the version number shown to users [...] -> https://developer.android.com/studio/publish/versioning
const versionNameRegexPattern = /(versionName(?:\s|=)*)(.*)/;
const groupVersionNameValueIndex = 2


// semver version regex — https://semver.org/ and added (\") as optional for Android version name string support
const semverVersionFromVersionNameRegexPattern = /^(\")?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?(\")?$/;
const groupMajorVersionIndex = 2
const groupMinorVersionIndex = 3
const groupPatchVersionIndex = 4
const groupPrereleaseBuildIndex = 5
const groupBuildMetaDataIndex = 6
// extract the build number from the prerelease version ({stage}.{buildNumber})
const prereleaseBuildNumberRegexPattern = /(.*)(\.)(\d+)$/
const groupPrereleaseIndex = 1
const groupBuildNumberIndex = 3


try {
	const gradlePath = core.getInput('gradlePath');
	console.log(`Gradle Path : ${gradlePath}`);

	fs.readFile(gradlePath, 'utf8', function (err, data) {
		if (err) {
			core.setFailed(err.message);
			return
		}
		newGradle = data;

		const versionCode = newGradle.match(versionCodeRegexPattern)[groupVersionCodeValueIndex];
		const versionName = newGradle.match(versionNameRegexPattern)[groupVersionNameValueIndex];
		const semverVersionMatch = versionName.match(semverVersionFromVersionNameRegexPattern);

		const majorVersion = semverVersionMatch[groupMajorVersionIndex];
		const minorVersion = semverVersionMatch[groupMinorVersionIndex];
		const patchVersion = semverVersionMatch[groupPatchVersionIndex];
		const prereleaseVersion = semverVersionMatch[groupPrereleaseBuildIndex];
		const buildMetaDataVersion = semverVersionMatch[groupBuildMetaDataIndex];

		console.log(`versionName : ${versionName}`);
		core.setOutput("versionName", `${versionName}`);

		console.log(`versionCode : ${versionCode}`);
		core.setOutput("versionCode", `${versionCode}`);

		core.setOutput("majorVersion", `${majorVersion}`);
		core.setOutput("minorVersion", `${minorVersion}`);
		core.setOutput("patchVersion", `${patchVersion}`);

		if (prereleaseVersion)
			core.setOutput("prereleaseVersion", `${prereleaseVersion}`);

		if (buildMetaDataVersion)
			core.setOutput("buildMetaDataVersion", `${buildMetaDataVersion}`);

		if (prereleaseVersion && prereleaseVersion.length > 0) {
			const prereleaseBuildNumberMatch = prereleaseVersion.match(prereleaseBuildNumberRegexPattern)
			if (prereleaseBuildNumberMatch && prereleaseBuildNumberMatch.length >= groupPrereleaseIndex) {
				const prereleaseStage = prereleaseBuildNumberMatch[groupPrereleaseIndex];
				if (prereleaseStage) {
					core.setOutput("prereleaseStage", `${prereleaseStage}`);
				}
			} else {
				core.setOutput("prereleaseStage", `${prereleaseVersion}`);
			}
			if (prereleaseBuildNumberMatch && prereleaseBuildNumberMatch.length >= groupBuildNumberIndex) {
				const prereleaseBuildNumber = prereleaseBuildNumberMatch[groupBuildNumberIndex];
				if (prereleaseBuildNumber && prereleaseBuildNumber.length > 0) {
					core.setOutput("prereleaseBuildNumber", `${prereleaseBuildNumber}`);
				}
			}
		}

		if (buildMetaDataVersion && buildMetaDataVersion.length > 0) {
			const buildMetaDataBuildNumberMatch = buildMetaDataVersion.match(prereleaseBuildNumberRegexPattern)
			if (buildMetaDataBuildNumberMatch && buildMetaDataBuildNumberMatch.length >= groupPrereleaseIndex) {
				const buildMetaDataType = buildMetaDataBuildNumberMatch[groupPrereleaseIndex];
				if (buildMetaDataType) {
					core.setOutput("buildMetaDataType", `${buildMetaDataType}`);
				}
			} else {
				core.setOutput("buildMetaDataType", `${buildMetaDataType}`);
			}
			if (buildMetaDataBuildNumberMatch && buildMetaDataBuildNumberMatch.length >= groupBuildNumberIndex) {
				const buildMetaDataBuildNumber = buildMetaDataBuildNumberMatch[groupBuildNumberIndex];
				if (buildMetaDataBuildNumber) {
					core.setOutput("buildMetaDataBuildNumber", `${buildMetaDataBuildNumber}`);
				}
			}
		}
	});

} catch (error) {
	core.setFailed(error.message);
}
