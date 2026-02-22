
{
        description = "React Native dev shell";

        inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

        outputs = { self, nixpkgs }:
                let
                system = "x86_64-linux";
        pkgs = import nixpkgs {
                inherit system;
                config = {
                        allowUnfree = true;
                        android_sdk.accept_license = true;
                };
        };

        androidSdk = pkgs.androidenv.composeAndroidPackages {
                platformVersions = [ "36" ];
                buildToolsVersions = [ "35.0.0" "36.0.0"];
                includeEmulator = false;
                includeSystemImages = false;
                ndkVersions = [ "27.1.12297006" ]; 
                includeNDK = true; 
                cmakeVersions = [ "3.22.1" ];
                includeCmake = true; 

        };

        in {

                     devShells.${system}.default = pkgs.mkShell {
        buildInputs = [
          pkgs.android-studio
          pkgs.jdk17
          pkgs.gradle
          androidSdk.androidsdk
          pkgs.nodejs_20
          pkgs.google-chrome
          pkgs.eas-cli
        ];

        ANDROID_HOME = "${androidSdk.androidsdk}/libexec/android-sdk";
        ANDROID_SDK_ROOT = "${androidSdk.androidsdk}/libexec/android-sdk";

        shellHook = ''
          export PATH=$ANDROID_HOME/platform-tools:$PATH
          export REACT_DEBUGGER="google-chrome"
          echo " DevEnv ready"
          zsh
        '';

        };
        };

}
