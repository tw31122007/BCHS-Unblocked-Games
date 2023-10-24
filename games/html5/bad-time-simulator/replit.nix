{ pkgs }: {
  deps = [
    pkgs.zip
    pkgs.nodePackages.vscode-langservers-extracted
    pkgs.nodePackages.typescript-language-server
  ];
}