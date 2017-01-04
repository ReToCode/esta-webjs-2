/**
 * Copyright (C) Schweizerische Bundesbahnen SBB, 2015.
 *
 * ESTA WebJS: Code vom yeoman-generator
 * - Fragt den Benutzter nach den Projektangaben
 * - Kopiert das ESTA WebJS 2 BETA Starterkit
 * - Fuegt Projektnamen & Version in die Dateien ein
 *
 * @author u220374 (Reto Lehmann)
 * @version: 2.0.0
 * @since 23.10.2015, 2015.
 */
var generators = require('yeoman-generator');
var pkg = require('../package.json');
var yosay = require('yosay');

var getDependencyVersionsFromPackageJson = function(yo) {
    var packageJsonPath = yo.templatePath('package.json');
    var packageJson = yo.fs.readJSON(packageJsonPath);
    var result = [];
    Object.getOwnPropertyNames(packageJson.dependencies).forEach(function(key) {
        result.push(key + '@' + packageJson.dependencies[key]);
    });
    return result;
};

module.exports = generators.Base.extend({
    /**
     * #############################################################
     * Allgemeiner Teil
     * #############################################################
     */

    /**
     * Konfiguriere den Generator
     * - Fuegt die Option --update hinzu
     */
    constructor: function () {
        var yo = this;
        generators.Base.apply(yo, arguments);
        yo.option('update');
    },

    /**
     * Schreibt den Willkommenstext
     * - Unterscheidet zwischen Installation/Update
     */
    logInfo: function () {
        var yo = this;
        yo.log(yosay('ESTA WebJS 2 generator ' + pkg.version));

        if (!yo.options.update) {
            yo.log('Please answer the following questions');
            yo.log('_____________________________________');
        } else {
            yo.log('Going to update your project');
            yo.log('_____________________________________');
        }
    },

    /**
     * #############################################################
     * INSTALLATION
     * #############################################################
     */

    /**
     * INSTALLATION: Fragt den User nach seinen Einstellungen
     */
    askInstallQuestions: function () {
        var yo = this;

        if (yo.options.update) {
            return;
        }

        var done = yo.async();
        var prompts = [
            {
                name: 'projectName',
                message: 'What is the project name',
                default: 'esta-webjs'
            }, {
                name: 'projectDescription',
                message: 'What is the project description',
                default: 'ESTA WebJS Starterkit'
            }, {
                name: 'projectVersion',
                message: 'What is the project version',
                default: '1.0.0'
            }, {
                name: 'mavenGroupId',
                message: 'What is the maven groupId',
                default: 'ch.sbb'
            }, {
                name: 'mavenArtifactId',
                message: 'What is the maven artifactId',
                default: 'meineAnwendung'
            }
        ];

        yo.prompt(prompts, function (props) {
            yo.projectName = props.projectName;
            yo.projectDescription = props.projectDescription;
            yo.projectVersion = props.projectVersion;
            yo.mavenGroupId = props.mavenGroupId;
            yo.mavenArtifactId = props.mavenArtifactId;

            done();
        }.bind(yo));
    },

    /**
     * INSTALLATION: Sicherheitscheck: Prueft ob packages.json in Zielordner schon existiert
     */
    checkDirectoryEmpty: function () {
        var yo = this;

        if (yo.options.update) {
            return;
        }

        if (yo.fs.exists(yo.destinationRoot() + '\\package.json')) {

            yo.log(yosay('Found existing file: package.json. Do you want to update? Call me with --update.'));
            yo.env.error("Stopped because of existing file.");
        }
    },

    /**
     * INSTALLATION: Schreibt die User-Einstellungen
     */
    logInstallVariables: function () {
        var yo = this;

        if (yo.options.update) {
            return;
        }

        yo.log('_____________________________________');
        yo.log('Going to create your project');
        yo.log('ProjectName: ' + yo.projectName);
        yo.log('ProjectVersion: ' + yo.projectVersion);
        yo.log('Maven GroupId: ' + yo.mavenGroupId);
        yo.log('Maven ArtifactId: ' + yo.mavenArtifactId);
    },

    /**
     * INSTALLATION: Kopiert alle Dateien von app/templates ins Zielverzeichnis
     */
    copyInstallFiles: function () {
        var yo = this;

        if (yo.options.update) {
            return;
        }

        var done = yo.async();

        yo.log('Now copying all files for starterkit');
        yo.directory(yo.sourceRoot(), yo.destinationRoot());

        // Update files with variable fields
        yo.log('Now copying all templated files for starterkit');

        // Package.json
        yo.fs.copy(yo.templatePath('package.json'), yo.destinationPath('package.json'), {
            process: function (content) {

                // Replace name & version
                return content.toString()
                    .replace(/esta\-webjs\-2\-starterkit/, yo.projectName)
                    .replace(/ESTA WebJS Angular 2 Starterkit/, yo.projectDescription)
                    .replace(/"version": "\d{0,2}.\d{0,2}.\d{0,2}"/, '"version": "' + yo.projectVersion + '"');
            }
        });

        // pom.xml
        yo.fs.copy(yo.templatePath('pom.xml'), yo.destinationPath('pom.xml'), {
            process: function (content) {

                var versionSnapshotRegex = new RegExp('<version>' + pkg.version + '-SNAPSHOT<\/version>');
                var versionReleaseRegex = new RegExp('<version>' + pkg.version + '-RELEASE<\/version>');

                // Replace name & version
                return content.toString()
                    .replace(/<groupId>ch\.sbb\.esta\.webjs<\/groupId>/, '<groupId>' + yo.mavenGroupId + '</groupId>')
                    .replace(/<artifactId>esta-webjs-2-starterkit<\/artifactId>/, '<artifactId>' + yo.mavenArtifactId + '</artifactId>')
                    .replace(versionSnapshotRegex, '<version>' + yo.projectVersion + '</version>')
                    .replace(versionReleaseRegex, '<version>' + yo.projectVersion + '</version>');
            }
        });

        // *.iml File loeschen
        yo.fs.delete(yo.destinationPath('esta-webjs-starterkit.iml'));

        done();
    },

    /**
     * INSTALLATION: Installiert alle NPM Pakete
     */
    runNpm: function () {
        var yo = this;

        if (yo.options.update) {
            return;
        }

        yo.installDependencies({
            bower: false,
            npm: true,
            callback: function () {
                yo.log(yosay('Everything is ready - open your console and type \"gulp\"!'));
            }
        });
    },

    /**
     * #############################################################
     * Update
     * #############################################################
     */

    /**
     * UPDATE: Fragt den User nach seinen Einstellungen
     */
    askUpdateQuestion: function () {
        var yo = this;

        if (!yo.options.update) {
            return;
        }

        yo.log('The following npm packages will be updated:');
        yo.log(getDependencyVersionsFromPackageJson(yo));

        var done = yo.async();
        yo.prompt({
            type: 'confirm',
            name: 'continue',
            message: 'Do you want to continue?'
        }, function (answers) {
            yo.continueUpdate = answers.continue;

            if (!yo.continueUpdate) {
                yo.log(yosay('Update cancelled by user. Goodbye...'));
                yo.env.success("Done");
            }

            done();
        }.bind(yo));
    },

    /**
     * UPDATE: Installiert die neuen notwendigen Pakete
     */
    runNpmUpdate: function () {
        var yo = this;

        if (!yo.options.update || !yo.continueUpdate) {
            return;
        }

        yo.npmInstall(getDependencyVersionsFromPackageJson(yo), {'save': true}, function () {
            yo.log(yosay('Everything is ready - open your console and type \"gulp\"!'));
        });
    },

    /**
     * UPDATE: Entfernt nicht mehr benoetigte Pakete
     */
    removeOldPackages: function() {
        var yo = this;

        if (!yo.options.update || !yo.continueUpdate) {
            return;
        }

        // nothing to do yet
    },

    /**
     * UPDATE: Kopiert neue/geanderte Dateien
     */
    copyNewAndChangedFiles: function () {
        var yo = this;

        if (!yo.options.update) {
            return;
        }

        yo.log('Nothing to do yet');
    },

    /**
     * Manuell beenden aufgrund von Bug in Yeoman mit Windows
     */
    end: function() {
        process.exit(0);
    }
});

