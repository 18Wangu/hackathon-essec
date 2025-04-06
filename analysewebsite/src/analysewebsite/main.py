# analysewebsite/src/analysewebsite/main.py

import sys
import os

# Ajoute le dossier "src" dans le chemin Python
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from analysewebsite.crew import WebsiteSecurityCrew

def run():
    if len(sys.argv) < 2:
        print("Usage: python3 main.py <website_url>")
        sys.exit(1)
    url = sys.argv[1]
    inputs = {
        'website_url': url
    }
    crew = WebsiteSecurityCrew().crew()
    result = crew.kickoff(inputs=inputs)
    print(result)  # Affichez le résultat pour le récupérer dans l'API

if __name__ == '__main__':
    run()