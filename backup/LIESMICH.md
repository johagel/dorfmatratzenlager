# Datensicherungen

Alle zwei Monate legt GitHub hier automatisch eine Sicherung ab (Ablauf „Datensicherung“).
Die Dateien sind mit dem Gruppen-Code verschlüsselt. Entschlüsseln:

    openssl enc -d -aes-256-cbc -pbkdf2 -in sicherung-JJJJ-MM-TT.json.enc -out sicherung.json

(fragt nach dem Gruppen-Code). Eine Sicherung sofort anlegen: Actions → Datensicherung → Run workflow.
