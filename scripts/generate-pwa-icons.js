import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// PWA에 필요한 모든 아이콘 크기
const iconSizes = [
  16, 32, 72, 96, 128, 144, 152, 192, 384, 512,
  // Apple Touch Icon sizes
  57, 60, 72, 76, 114, 120, 144, 152, 180
];

const publicDir = path.join(__dirname, '..', 'public');
const faviconSvg = path.join(publicDir, 'favicon.svg');

// SVG 내용 읽기
const svgContent = fs.readFileSync(faviconSvg, 'utf8');

// 간단한 SVG to Base64 변환 (브라우저에서 실행용)
const generateHtml = () => {
  const html = `
<!DOCTYPE html>
<html>
<head>
    <title>PWA 아이콘 생성기</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .icon { margin: 10px; display: inline-block; text-align: center; }
        canvas { border: 1px solid #ccc; }
    </style>
</head>
<body>
    <h1>PWA 아이콘 생성 중...</h1>
    <div id="output"></div>
    
    <script>
        const svgContent = \`${svgContent}\`;
        const sizes = ${JSON.stringify(iconSizes)};
        
        function downloadCanvas(canvas, filename) {
            const link = document.createElement('a');
            link.download = filename;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
        
        function generateIcon(size) {
            return new Promise((resolve) => {
                const canvas = document.createElement('canvas');
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext('2d');
                
                // 흰색 배경
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, size, size);
                
                const img = new Image();
                const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
                const url = URL.createObjectURL(svgBlob);
                
                img.onload = () => {
                    ctx.drawImage(img, 0, 0, size, size);
                    URL.revokeObjectURL(url);
                    
                    // 파일명 결정
                    let filename;
                    if ([57, 60, 72, 76, 114, 120, 144, 152, 180].includes(size)) {
                        filename = \`apple-touch-icon-\${size}x\${size}.png\`;
                    } else {
                        filename = \`icon-\${size}x\${size}.png\`;
                    }
                    
                    // 출력 영역에 표시
                    const div = document.createElement('div');
                    div.className = 'icon';
                    div.innerHTML = \`
                        <div>\${filename}</div>
                        <canvas width="\${Math.min(size, 100)}" height="\${Math.min(size, 100)}"></canvas>
                        <br>
                        <button onclick="downloadCanvas(this.previousElementSibling.previousElementSibling, '\${filename}')">다운로드</button>
                    \`;
                    
                    const previewCanvas = div.querySelector('canvas');
                    const previewCtx = previewCanvas.getContext('2d');
                    const previewSize = Math.min(size, 100);
                    previewCtx.fillStyle = '#FFFFFF';
                    previewCtx.fillRect(0, 0, previewSize, previewSize);
                    previewCtx.drawImage(img, 0, 0, previewSize, previewSize);
                    
                    document.getElementById('output').appendChild(div);
                    resolve();
                };
                
                img.src = url;
            });
        }
        
        async function generateAllIcons() {
            for (const size of sizes) {
                await generateIcon(size);
            }
            
            // 모든 아이콘을 한 번에 다운로드할 수 있는 버튼 추가
            const downloadAllBtn = document.createElement('button');
            downloadAllBtn.textContent = '모든 아이콘 다운로드 (ZIP)';
            downloadAllBtn.style.cssText = 'margin: 20px; padding: 10px 20px; font-size: 16px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;';
            downloadAllBtn.onclick = () => {
                alert('각 아이콘을 개별적으로 다운로드하여 public 폴더에 저장해주세요.');
            };
            document.body.appendChild(downloadAllBtn);
        }
        
        generateAllIcons();
    </script>
</body>
</html>
  `;
  
  return html;
};

// HTML 파일 생성
const htmlContent = generateHtml();
const htmlPath = path.join(publicDir, 'generate-icons.html');
fs.writeFileSync(htmlPath, htmlContent);

console.log('아이콘 생성기가 생성되었습니다!');
console.log(`브라우저에서 ${htmlPath} 파일을 열어서 아이콘들을 다운로드하세요.`);
console.log('또는 다음 URL로 접속: http://localhost:5173/generate-icons.html'); 