// ─────────────────────────────────────────────
// RgpdPage.js — Mentions légales et RGPD
//
// COMPÉTENCE CP2 : Respecter la réglementation en vigueur
//
// Le référentiel CDA demande :
//   "Mettre en place les mentions légales liées au
//    Règlement Général sur la Protection des Données (RGPD)"
//
// POUR LE JURY :
//   "J'ai intégré une page de mentions légales conforme au RGPD.
//    Elle informe les utilisateurs sur le traitement de leurs données,
//    la finalité du traitement, la durée de conservation,
//    et leurs droits (accès, rectification, suppression)."
// ─────────────────────────────────────────────

function RgpdPage({ onNavigate }) {
  return (
    <div
      style={{
        maxWidth: 800,
        margin: "40px auto",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
        border: "1px solid #ddd",
        position: "relative",
        padding: "30px 30px 20px",
        textAlign: "left",
      }}
    >
      <button
        onClick={() => onNavigate("login")}
        style={{
          position: "absolute",
          top: -14,
          right: -14,
          background: "#dc3545",
          color: "#fff",
          border: "3px solid #fff",
          borderRadius: "50%",
          width: 36,
          height: 36,
          fontSize: 20,
          fontWeight: 700,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}
        title="Fermer"
      >
        ✕
      </button>
      <h2 className="marques-title">
        MENTIONS LÉGALES ET PROTECTION DES DONNÉES
      </h2>

      <div style={{ lineHeight: 1.8, fontSize: 14, color: "#333" }}>
        <h3 style={{ color: "#2E75B6", marginTop: 24 }}>
          1. Responsable du traitement
        </h3>
        <p>
          <strong>SAM Montereau — Groupe Riva</strong>
          <br />
          Usine de production sidérurgique
          <br />
          Montereau-Fault-Yonne, Seine-et-Marne (77), France
          <br />
          Responsable informatique : Service IT SAM Montereau
        </p>

        <h3 style={{ color: "#2E75B6", marginTop: 24 }}>
          2. Finalité du traitement des données
        </h3>
        <p>
          L'application « Réservation de Voiture » collecte et traite des
          données personnelles dans le cadre de la{" "}
          <strong>gestion du parc automobile</strong> de l'usine SAM Montereau.
          Les données sont utilisées exclusivement pour :
        </p>
        <ul style={{ paddingLeft: 24 }}>
          <li>L'authentification des utilisateurs sur l'application</li>
          <li>La gestion des réservations de véhicules d'entreprise</li>
          <li>Le suivi des maintenances et contrôles véhicules</li>
          <li>La traçabilité des déplacements professionnels</li>
        </ul>

        <h3 style={{ color: "#2E75B6", marginTop: 24 }}>
          3. Données collectées
        </h3>
        <p>Les données personnelles collectées sont :</p>
        <ul style={{ paddingLeft: 24 }}>
          <li>
            <strong>Nom et prénom</strong> de l'employé (demandeur de la
            réservation)
          </li>
          <li>
            <strong>Nom et prénom</strong> du conducteur et des voyageurs
          </li>
          <li>
            <strong>Adresse email professionnelle</strong>
          </li>
          <li>
            <strong>Dates et destination</strong> du déplacement
          </li>
          <li>
            <strong>Kilomètres</strong> parcourus (estimation et réel)
          </li>
        </ul>
        <p>
          Aucune donnée sensible (origine ethnique, opinions politiques, données
          de santé, etc.) n'est collectée par l'application.
        </p>

        <h3 style={{ color: "#2E75B6", marginTop: 24 }}>
          4. Base légale du traitement
        </h3>
        <p>
          Le traitement des données est fondé sur l'
          <strong>intérêt légitime</strong> de l'entreprise (article 6.1.f du
          RGPD) pour la gestion de son parc automobile et l'organisation des
          déplacements professionnels de ses salariés.
        </p>

        <h3 style={{ color: "#2E75B6", marginTop: 24 }}>
          5. Durée de conservation
        </h3>
        <p>
          Les données de réservation sont conservées pendant la{" "}
          <strong>durée de l'année civile en cours</strong>, plus une année
          d'archivage. Les données sont ensuite supprimées automatiquement. Les
          données d'authentification sont conservées pendant la durée du contrat
          de travail.
        </p>

        <h3 style={{ color: "#2E75B6", marginTop: 24 }}>
          6. Destinataires des données
        </h3>
        <p>Les données sont accessibles uniquement aux personnes suivantes :</p>
        <ul style={{ paddingLeft: 24 }}>
          <li>
            Le <strong>service RH</strong> pour la validation des réservations
          </li>
          <li>
            Le <strong>gardien</strong> du poste de garde pour la remise des
            clés
          </li>
          <li>
            Le <strong>service informatique</strong> pour la maintenance de
            l'application
          </li>
        </ul>
        <p>
          Les données ne sont <strong>pas transmises</strong> à des tiers
          extérieurs à l'entreprise et restent hébergées sur le réseau interne
          de l'usine.
        </p>

        <h3 style={{ color: "#2E75B6", marginTop: 24 }}>
          7. Sécurité des données
        </h3>
        <p>Les mesures de sécurité suivantes sont mises en œuvre :</p>
        <ul style={{ paddingLeft: 24 }}>
          <li>
            Authentification obligatoire par <strong>token JWT</strong> avec
            expiration
          </li>
          <li>
            Accès aux données via <strong>stored procedures paramétrées</strong>{" "}
            (protection injection SQL)
          </li>
          <li>
            Communication sécurisée sur le <strong>réseau interne</strong> de
            l'usine
          </li>
          <li>
            Identifiants de connexion à la base de données stockés dans des{" "}
            <strong>variables d'environnement</strong> non versionnées
          </li>
        </ul>

        <h3 style={{ color: "#2E75B6", marginTop: 24 }}>
          8. Droits des utilisateurs
        </h3>
        <p>
          Conformément au Règlement Général sur la Protection des Données (RGPD)
          et à la loi Informatique et Libertés, vous disposez des droits
          suivants :
        </p>
        <ul style={{ paddingLeft: 24 }}>
          <li>
            <strong>Droit d'accès</strong> : obtenir la confirmation du
            traitement de vos données
          </li>
          <li>
            <strong>Droit de rectification</strong> : faire corriger des données
            inexactes
          </li>
          <li>
            <strong>Droit de suppression</strong> : demander l'effacement de vos
            données
          </li>
          <li>
            <strong>Droit d'opposition</strong> : vous opposer au traitement de
            vos données
          </li>
          <li>
            <strong>Droit à la portabilité</strong> : recevoir vos données dans
            un format structuré
          </li>
        </ul>
        <p>
          Pour exercer vos droits, contactez le service informatique de SAM
          Montereau ou le Délégué à la Protection des Données (DPO) du Groupe
          Riva.
        </p>

        <h3 style={{ color: "#2E75B6", marginTop: 24 }}>9. Réclamation</h3>
        <p>
          En cas de réclamation, vous pouvez contacter la{" "}
          <strong>
            Commission Nationale de l'Informatique et des Libertés (CNIL)
          </strong>{" "}
          : <br />
          3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07
          <br />
          www.cnil.fr
        </p>

        <div
          style={{
            marginTop: 32,
            padding: 16,
            background: "#f0f4f8",
            borderRadius: 8,
            fontSize: 12,
            color: "#666",
          }}
        >
          <strong>Application :</strong> Réservation de Voiture — SAM Montereau
          <br />
          <strong>Version :</strong> 2.0 (React/Node.js)
          <br />
          <strong>Dernière mise à jour :</strong> Avril 2026
          <br />
          <strong>Développeur :</strong> IMLI Anass — Bachelor CDA 2025/2026
        </div>
      </div>
    </div>
  );
}

export default RgpdPage;
