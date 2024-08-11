with import <nixpkgs> {};
let
  in stdenv.mkDerivation rec {
    name = "env"; 
    env = buildEnv {
      name = name;
      paths = buildInputs;
    };
    buildInputs = [
      nodejs-18_x
    ];
}
