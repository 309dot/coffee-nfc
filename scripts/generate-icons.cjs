const fs = require('fs');
const path = require('path');

// SVG 파일을 읽어서 PNG 아이콘으로 변환하는 스크립트
// 실제로는 ImageMagick이나 다른 도구를 사용해야 하지만, 
// 여기서는 기본 SVG를 복사하여 사용합니다.

const sizes = [
  { size: '16x16', name: 'icon-16x16.png' },
  { size: '32x32', name: 'icon-32x32.png' },
  { size: '57x57', name: 'apple-touch-icon-57x57.png' },
  { size: '60x60', name: 'apple-touch-icon-60x60.png' },
  { size: '72x72', name: 'apple-touch-icon-72x72.png' },
  { size: '76x76', name: 'apple-touch-icon-76x76.png' },
  { size: '114x114', name: 'apple-touch-icon-114x114.png' },
  { size: '120x120', name: 'apple-touch-icon-120x120.png' },
  { size: '144x144', name: 'apple-touch-icon-144x144.png' },
  { size: '152x152', name: 'apple-touch-icon-152x152.png' },
  { size: '180x180', name: 'apple-touch-icon-180x180.png' },
  { size: '192x192', name: 'icon-192x192.png' },
  { size: '512x512', name: 'icon-512x512.png' }
];

const publicDir = path.join(__dirname, '../public');
const sourceSvg = path.join(publicDir, 'favicon.svg');

// SVG 내용을 읽어서 PNG 용 SVG로 수정
const svgContent = fs.readFileSync(sourceSvg, 'utf8');

console.log('아이콘 생성을 시작합니다...');
console.log('실제 PNG 파일 생성을 위해서는 ImageMagick, Sharp 등의 도구가 필요합니다.');
console.log('현재는 SVG 파일을 복사하여 임시로 사용합니다.');

// 임시로 SVG 파일을 각 크기에 맞게 복사
sizes.forEach(({ size, name }) => {
  const targetPath = path.join(publicDir, name.replace('.png', '.svg'));
  
  // SVG 내용에 크기 정보 추가
  const modifiedSvg = svgContent.replace(
    '<svg',
    `<svg width="${size.split('x')[0]}" height="${size.split('x')[1]}"`
  );
  
  try {
    fs.writeFileSync(targetPath, modifiedSvg);
    console.log(`✓ 생성됨: ${name} (${size})`);
  } catch (error) {
    console.error(`✗ 실패: ${name} - ${error.message}`);
  }
});

console.log('\n아이콘 생성이 완료되었습니다!');
console.log('\n실제 운영환경에서는 다음 도구들을 사용하여 PNG 파일을 생성하세요:');
console.log('- ImageMagick: convert favicon.svg -resize 192x192 icon-192x192.png');
console.log('- Sharp (Node.js): sharp(svgBuffer).resize(192, 192).png().toFile()');
console.log('- 온라인 도구: https://realfavicongenerator.net/');

module.exports = { sizes }; 