{
  description = "Vibes marketing website";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_22
            pnpm
            nodePackages.wrangler
            just
          ];

          shellHook = ''
            echo "Vibes dev environment loaded"
            echo "Run 'just' to see available commands"
          '';
        };
      }
    );
}
