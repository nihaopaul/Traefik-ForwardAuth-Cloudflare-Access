{ pkgs ? import <nixpkgs> {} }:
with pkgs;

let 

in stdenv.mkDerivation {

  name = "forward-auth";

  src = ./build;

  buildInputs = [

    # Project dependencies
    nodejs-12_x 
    # utilities
    nodePackages.yarn
    
  ] ++ stdenv.lib.optional stdenv.isDarwin [ pkgs.darwin.apple_sdk.frameworks.CoreServices ];

  shellHook = ''
    export PATH=$(pwd)/build/node_modules/.bin:$PATH
  '';


}