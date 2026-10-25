const modules = import.meta.glob('./elements/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
});

export const ELEMENTS = Object.entries(modules).reduce((acc, [path, url]) => {
  const match = path.match(/(\d+)element\.svg$/);
  if (match) acc[Number(match[1])] = url;
  return acc;
}, {});

export const elementUrl = (n) => ELEMENTS[n] || null;

export const elementCount = Object.keys(ELEMENTS).length;

export default ELEMENTS;
