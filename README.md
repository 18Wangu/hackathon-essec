# 🛡️ SafeQR – Détecteur de phishing pour QR codes

Projet réalisé dans le cadre de l’ESSEC Hackathon 2025.

SafeQR est une application fullstack capable d’analyser les URLs extraites de QR codes afin de détecter tout comportement de phishing ou site malveillant. Elle combine analyse technique (via un script Python) et intelligence artificielle (via Mistral) pour générer un diagnostic clair, un score de sécurité, et une synthèse compréhensible.

---

## 🚀 Fonctionnalités principales

- 🔍 Analyse technique de l’URL (certificat SSL, IP, redirections, etc.)
- 🤖 Appel à l’API Mistral pour avis cybersécurité
- 🧠 Synthèse finale combinée des analyses
- 📊 Score de sécurité généré automatiquement
- 🧪 API REST pour lancer l’analyse depuis l’interface web

---

## 🧩 Technologies utilisées

- **Frontend** : Next.js + Tailwind CSS (dans `safeqr/`)
- **Backend** : API Routes Next.js (`/api/analyze`)
- **Python** : Analyse technique dans `analysewebsite/`
- **Mistral API** : Modèle mistral-7B pour l'analyse sémantique
- **Git** : pour la gestion de version

---

## 📁 Structure du projet

