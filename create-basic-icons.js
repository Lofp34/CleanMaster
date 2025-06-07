const fs = require('fs');
const path = require('path');

// Créer le contenu SVG sous forme de data URL
const createIconDataUrl = (size) => {
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
      <defs>
        <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#7c3aed;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#a855f7;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 10}" fill="url(#bg-gradient)" stroke="#5b21b6" stroke-width="4"/>
      
      <!-- Brush icon simplified -->
      <g transform="translate(${size/2},${size/2}) rotate(-30) scale(${size/200})">
        <rect x="-40" y="-4" width="70" height="8" rx="4" fill="#8b4513"/>
        <rect x="25" y="-6" width="10" height="12" rx="1" fill="#c0c0c0"/>
        <g fill="#4ade80">
          <rect x="34" y="-5" width="2" height="14" rx="1"/>
          <rect x="37" y="-4" width="2" height="13" rx="1"/>
          <rect x="40" y="-6" width="2" height="15" rx="1"/>
          <rect x="43" y="-4" width="2" height="13" rx="1"/>
        </g>
      </g>
      
      <!-- Stars -->
      <g fill="#fbbf24">
        <circle cx="${size*0.3}" cy="${size*0.25}" r="${size*0.02}"/>
        <circle cx="${size*0.7}" cy="${size*0.3}" r="${size*0.015}"/>
        <circle cx="${size*0.25}" cy="${size*0.7}" r="${size*0.02}"/>
        <circle cx="${size*0.75}" cy="${size*0.65}" r="${size*0.015}"/>
      </g>
      
      <!-- Text for larger sizes -->
      ${size >= 144 ? `<text x="${size/2}" y="${size*0.85}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${size*0.08}" font-weight="bold">CM</text>` : ''}
    </svg>
  `;
  
  return 'data:image/svg+xml;base64,' + Buffer.from(svgContent).toString('base64');
};

// Créer un fichier PNG simple pour chaque taille
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

console.log('🎨 Création des icônes CleanMaster...');

// Pour une approche simple, créons des fichiers de placeholder
iconSizes.forEach(size => {
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    <defs>
      <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#7c3aed;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#a855f7;stop-opacity:1" />
      </linearGradient>
    </defs>
    
    <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 8}" fill="url(#bg-gradient)" stroke="#5b21b6" stroke-width="4"/>
    
    <g transform="translate(${size/2},${size/2}) rotate(-30) scale(${size/300})">
      <rect x="-40" y="-4" width="70" height="8" rx="4" fill="#8b4513"/>
      <rect x="25" y="-6" width="10" height="12" rx="1" fill="#c0c0c0"/>
      <g fill="#4ade80">
        <rect x="34" y="-5" width="2" height="14" rx="1"/>
        <rect x="37" y="-4" width="2" height="13" rx="1"/>
        <rect x="40" y="-6" width="2" height="15" rx="1"/>
        <rect x="43" y="-4" width="2" height="13" rx="1"/>
      </g>
    </g>
    
    <g fill="#fbbf24">
      <circle cx="${size*0.3}" cy="${size*0.25}" r="${Math.max(2, size*0.02)}"/>
      <circle cx="${size*0.7}" cy="${size*0.3}" r="${Math.max(1, size*0.015)}"/>
      <circle cx="${size*0.25}" cy="${size*0.7}" r="${Math.max(2, size*0.02)}"/>
      <circle cx="${size*0.75}" cy="${size*0.65}" r="${Math.max(1, size*0.015)}"/>
    </g>
    
    ${size >= 144 ? `<text x="${size/2}" y="${size*0.85}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${Math.max(12, size*0.08)}" font-weight="bold">CM</text>` : ''}
  </svg>`;
  
  fs.writeFileSync(path.join('icons', `icon-${size}x${size}.svg`), svgContent);
  console.log(`✅ Créé: icon-${size}x${size}.svg`);
});

console.log('🎉 Toutes les icônes SVG ont été créées !');
console.log('📱 Pour les utiliser en PWA:');
console.log('1. Ouvrez generate-icons.html dans votre navigateur');
console.log('2. Générez les PNG à partir des SVG');
console.log('3. Placez les PNG dans le dossier icons/');
console.log('4. Votre PWA sera prête pour iPhone !'); 