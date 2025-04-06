// safeqr/src/app/api/analyze/route.ts

import { NextResponse } from 'next/server';
import { spawn } from 'child_process';

export async function POST(request: Request) {
  console.log("Requête POST reçue sur /api/analyze");
  try {
    const { url } = await request.json();
    if (!url) {
      console.log("Aucune URL fournie dans la requête");
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }

    // Exécution du script Python pour analyser le site
    console.log(`Appel du script Python pour analyser le site. URL: ${url}`);
    return new Promise(async (resolve) => {
      try {
        const pythonProcess = spawn(
          '/Users/theopremartin/Documents/Hackthons crypto/ESSEC Hackathon/analysewebsite/venv/bin/python3',
          ['/Users/theopremartin/Documents/Hackthons crypto/ESSEC Hackathon/analysewebsite/src/analysewebsite/main.py', url]
        );

        let pythonOutput = '';
        pythonProcess.stdout.on('data', (data) => {
          const output = data.toString();
          pythonOutput += output;
          console.log("Sortie Python (stdout):", output);
        });

        pythonProcess.stderr.on('data', (data) => {
          console.error("Erreur Python (stderr):", data.toString());
        });

        pythonProcess.on('close', async (code) => {
          console.log(`Processus Python terminé avec le code ${code}`);
          if (code !== 0) {
            console.error("Le script Python a échoué");
            return resolve(NextResponse.json({ error: 'Python script failed' }, { status: 500 }));
          }

          console.log("Appel de l'API OpenAI pour l'analyse de l'URL...");
          const urlAnalysis = await analyzeUrlWithOpenAI(url);
          console.log("Résultat de l'analyse de l'URL :", urlAnalysis);

          // Appel de la fonction de synthèse pour combiner les deux résumés
          const finalSynthesis = await synthesizeSummaries(pythonOutput, urlAnalysis);
          console.log("Synthèse finale générée :", finalSynthesis);

          // Calcul du score de sécurité à partir du résumé final
          const score = computeSecurityScore(finalSynthesis);

          return resolve(
            NextResponse.json({
              finalReport: finalSynthesis,
              score: score
            })
          );
        });
      } catch (error: any) {
        console.error("Erreur lors de l'exécution du processus Python:", error);
        return resolve(NextResponse.json({ error: error.message }, { status: 500 }));
      }
    });
  } catch (error: any) {
    console.error("Erreur lors du traitement de la requête :", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function analyzeUrlWithOpenAI(url: string): Promise<string> {
  try {
    console.log("Envoi de la requête Mistral pour l'URL :", url);
    const response = await fetch("https://api.mistral.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mistral-7b",
        messages: [
          {
            role: "system",
            content: `Tu es un expert en cybersécurité spécialisé dans la détection de phishing. Pour chaque URL reçue, analyse minutieusement :
            
1. Le protocole et le certificat SSL,
2. L'utilisation d'adresses IP,
3. La longueur et la complexité,
4. Les caractères trompeurs,
5. Les sous-domaines et redirections.

Si l'URL respecte toutes ces normes, réponds URL OK, sinon URL suspecte, suivi d'une explication en 150 à 300 caractères.`
          },
          {
            role: "user",
            content: `Analyse cette URL : ${url}`
          }
        ]
      })
    });

    if (!response.ok) {
      console.error("Erreur réponse API mistral :", response.status, response.statusText);
      throw new Error("Erreur API mistral");
    }
    const data = await response.json();
    console.log("Réponse mistral reçue :", data);
    return data.choices[0].message.content || "Réponse vide.";
  } catch (error: any) {
    console.error("Erreur lors de l'appel à mistral :", error);
    return "Erreur de communication avec Mistral.";
  }
}

async function synthesizeSummaries(summary1: string, summary2: string): Promise<string> {
  try {
    const combinedText = `${summary1}\n${summary2}`;
    const response = await fetch("https://api.mistral.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mistral-7b",
        messages: [
          {
            role: "system",
            content: "À partir des deux résumés fournis, génère un résumé unique. Si l'URL respecte toutes ces normes, réponds par URL OK, sinon par URL suspecte, suivi d'une explication en 200 à 500 caractères."
          },
          {
            role: "user",
            content: `Voici le premier résumé : ${summary1}\n\nVoici le deuxième résumé : ${summary2}`
          }
        ]
      })
    });
  
    if (!response.ok) {
      console.error("Erreur réponse API Mistral lors de la synthèse:", response.status, response.statusText);
      throw new Error("Erreur API Mistral lors de la synthèse");
    }
    const data = await response.json();
    return data.choices[0].message.content || "Résumé vide.";
  } catch (error: any) {
    console.error("Erreur lors de l'appel à Mistral pour la synthèse :", error);
    return "Erreur de communication avec Mistral lors de la synthèse.";
  }
}

function computeSecurityScore(finalReport: string): number {
  let score = 0;
  
  // Points pour indicateurs positifs
  if (finalReport.includes("Site OK") || finalReport.includes("URL OK")) score += 50;
  if (!finalReport.includes("vulnérabilités majeures")) score += 30;
  if (finalReport.includes("protocole HTTPS sécurisé")) score += 20;
  if (finalReport.includes("navigation claire")) score += 10;
  
  // Points négatifs
  if (finalReport.includes("vulnérabilités")) score -= 40;
  if (finalReport.includes("manque d'informations sur les mises à jour")) score -= 20;
  
  return score;
}
