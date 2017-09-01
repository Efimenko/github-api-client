export const closest = (node, parent) => {
  while (node) {
    if (node === parent) return node;
    else node = node.parentElement;
  }
  return null;
}
