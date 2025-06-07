#!/usr/bin/env python3
"""
Serveur simple pour tester la PWA CleanMaster en local
Supporte HTTPS pour les Service Workers
"""
import http.server
import socketserver
import ssl
import os
import webbrowser
from pathlib import Path

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Ajouter les en-têtes PWA nécessaires
        self.send_header('Cache-Control', 'no-cache')
        self.send_header('Service-Worker-Allowed', '/')
        super().end_headers()

def create_self_signed_cert():
    """Crée un certificat auto-signé pour le test local"""
    try:
        from cryptography import x509
        from cryptography.x509.oid import NameOID
        from cryptography.hazmat.primitives import hashes
        from cryptography.hazmat.backends import default_backend
        from cryptography.hazmat.primitives.asymmetric import rsa
        from cryptography.hazmat.primitives import serialization
        import datetime
        
        # Générer une clé privée
        private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048,
            backend=default_backend()
        )
        
        # Créer un certificat
        subject = issuer = x509.Name([
            x509.NameAttribute(NameOID.COUNTRY_NAME, "FR"),
            x509.NameAttribute(NameOID.STATE_OR_PROVINCE_NAME, "Paris"),
            x509.NameAttribute(NameOID.LOCALITY_NAME, "Paris"),
            x509.NameAttribute(NameOID.ORGANIZATION_NAME, "CleanMaster Dev"),
            x509.NameAttribute(NameOID.COMMON_NAME, "localhost"),
        ])
        
        cert = x509.CertificateBuilder().subject_name(
            subject
        ).issuer_name(
            issuer
        ).public_key(
            private_key.public_key()
        ).serial_number(
            x509.random_serial_number()
        ).not_valid_before(
            datetime.datetime.utcnow()
        ).not_valid_after(
            datetime.datetime.utcnow() + datetime.timedelta(days=365)
        ).add_extension(
            x509.SubjectAlternativeName([
                x509.DNSName("localhost"),
                x509.IPAddress("127.0.0.1"),
            ]),
            critical=False,
        ).sign(private_key, hashes.SHA256(), default_backend())
        
        # Sauvegarder le certificat et la clé
        with open("server.crt", "wb") as f:
            f.write(cert.public_bytes(serialization.Encoding.PEM))
        
        with open("server.key", "wb") as f:
            f.write(private_key.private_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PrivateFormat.PKCS8,
                encryption_algorithm=serialization.NoEncryption()
            ))
        
        return True
    except ImportError:
        print("⚠️  Module cryptography non disponible. Utilisation HTTP simple.")
        return False

def start_server():
    PORT = 8443  # Port HTTPS
    HTTP_PORT = 8080  # Port HTTP de fallback
    
    print("🚀 Démarrage du serveur CleanMaster PWA...")
    print(f"📁 Répertoire: {os.getcwd()}")
    
    # Essayer de créer un certificat SSL pour HTTPS
    has_ssl = False
    if not os.path.exists("server.crt") or not os.path.exists("server.key"):
        print("🔐 Création du certificat SSL...")
        has_ssl = create_self_signed_cert()
    else:
        has_ssl = True
    
    try:
        with socketserver.TCPServer(("", PORT if has_ssl else HTTP_PORT), CustomHTTPRequestHandler) as httpd:
            if has_ssl:
                # Configuration SSL
                context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
                context.load_cert_chain("server.crt", "server.key")
                httpd.socket = context.wrap_socket(httpd.socket, server_side=True)
                
                url = f"https://localhost:{PORT}"
                print(f"✅ Serveur HTTPS démarré sur {url}")
                print("🔒 Certificat auto-signé (attendez-vous à un avertissement de sécurité)")
            else:
                url = f"http://localhost:{HTTP_PORT}"
                print(f"✅ Serveur HTTP démarré sur {url}")
                print("⚠️  HTTP simple - Service Worker peut ne pas fonctionner")
            
            print("\n📱 Instructions pour installer sur iPhone:")
            print("1. Ouvrez Safari sur votre iPhone")
            print(f"2. Allez sur {url}")
            print("3. Appuyez sur le bouton Partager (📤)")
            print("4. Sélectionnez 'Ajouter à l'écran d'accueil'")
            print("5. L'app CleanMaster apparaîtra sur votre écran d'accueil!")
            print("\n🛑 Appuyez sur Ctrl+C pour arrêter le serveur")
            
            # Ouvrir automatiquement dans le navigateur
            webbrowser.open(url)
            
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 Serveur arrêté.")
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"❌ Port {PORT if has_ssl else HTTP_PORT} déjà utilisé.")
            print("Essayez de fermer les autres serveurs ou utilisez un autre port.")
        else:
            print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    start_server() 