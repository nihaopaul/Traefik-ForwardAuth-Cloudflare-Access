{ lib, nodePackages, stdenv, pkgs }:

stdenv.mkDerivation rec {
  name = "forwardauth-${version}";
  version = "1.0";

  src = ./build;

  meta = {
    description = "forwardauth code";
    maintainers = with lib.maintainers; [ nihaopaul ];
  };


}