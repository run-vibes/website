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
            typescript-go
          ];

          # System libraries required by Playwright browsers
          LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath (with pkgs; [
            # GTK and graphics
            gtk4
            gtk3
            glib
            pango
            cairo
            gdk-pixbuf
            harfbuzz
            graphene
            atk
            at-spi2-atk
            # Media
            gst_all_1.gstreamer
            gst_all_1.gst-plugins-base
            gst_all_1.gst-plugins-good
            gst_all_1.gst-plugins-bad
            # System
            libdrm
            mesa
            vulkan-loader
            systemd
            icu
            libatomic_ops
            xorg.libX11
            xorg.libXcomposite
            xorg.libXdamage
            xorg.libXext
            xorg.libXfixes
            xorg.libXrandr
            xorg.libxcb
            xorg.libxshmfence
            libxkbcommon
            wayland
            libpng
            zlib
            freetype
            fontconfig
            expat
            libsecret
            libtasn1
            libwebp
            nghttp2
            libpsl
            enchant
            hyphen
            libmanette
            libgbm
            # Audio
            alsa-lib
            pulseaudio
          ]);

          shellHook = ''
            echo "Vibes dev environment loaded"
            echo "Run 'just' to see available commands"
          '';
        };
      }
    );
}
