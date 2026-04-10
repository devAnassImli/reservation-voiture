// ============================================================
//  RÉSERVATION DE VOITURE — App.js
//  Étape 1 : Login + AuthContext + Layout + Routing
//
//  POUR TOI QUI APPRENDS REACT :
//  
//  En ASP.NET WebForms tu avais :
//    Session["S_CognomeNome"] = "DUPONT Jean";   → ici on utilise AuthContext
//    Response.Redirect("start.aspx");            → ici on change le state "page"
//    MasterPage.master                           → ici c'est le composant Layout
// ============================================================

import { useState, useEffect, createContext, useContext, useRef } from "react";
import './App.css';

// ─────────────────────────────────────────────
// 1. AUTH CONTEXT
// 
// C'est quoi ? Un "conteneur" qui stocke les infos de l'utilisateur connecté.
// Tous les composants de l'app peuvent y accéder.
//
// Ça remplace :
//   Session["S_CognomeNome"]  → user.cognomeNome
//   Session["S_Email"]        → user.email
//   Session["S_Codice"]       → user.codice
// ─────────────────────────────────────────────

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  // useState = une variable qui, quand elle change, re-affiche le composant
  // On initialise depuis localStorage (pour rester connecté si on recharge la page)
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("rv_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Fonction login → équivalent de Session["S_CognomeNome"] = dic.Item4;
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("rv_user", JSON.stringify(userData));
  };

  // Fonction logout → équivalent de Session.Abandon(); Session.Clear();
  const logout = () => {
    setUser(null);
    localStorage.removeItem("rv_user");
  };

  // On "fournit" user, login, logout à tous les composants enfants
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personnalisé — pour utiliser facilement dans n'importe quel composant
// Exemple : const { user } = useAuth();
function useAuth() {
  return useContext(AuthContext);
}

// ─────────────────────────────────────────────
// 2. DONNÉES MOCK (simulées)
//
// Plus tard on remplacera par des vrais appels fetch() vers ton API.
// Pour l'instant ça simule la connexion.
//
// Ça remplace :
//   ClassTools.AutenticazioneDominio(username, password)
// ─────────────────────────────────────────────

const MOCK_USERS = [
  {
    username: "anass.imli",
    password: "test123",
    cognomeNome: "IMLI Anass",
    email: "anass.imli@rivagroup.com",
    tipoIngresso: "1",
    codice: "1",
  },
  {
    username: "test",
    password: "test",
    cognomeNome: "TEST Utilisateur",
    email: "test@rivagroup.com",
    tipoIngresso: "1",
    codice: "1",
  },
];

async function mockLogin(username, password) {
  // Simule un délai réseau (comme quand le serveur met du temps à répondre)
  await new Promise((resolve) => setTimeout(resolve, 600));

  const found = MOCK_USERS.find(
    (u) => u.username === username && u.password === password
  );

  if (!found) {
    return { success: false, error: "NOM D'UTILISATEUR OU MOT DE PASSE INCORRECT" };
  }

  return {
    success: true,
    data: {
      cognomeNome: found.cognomeNome,
      email: found.email,
      tipoIngresso: found.tipoIngresso,
      codice: found.codice,
    },
  };
}

// ─────────────────────────────────────────────
// 3. PAGE LOGIN
//
// Reproduit Default.aspx + Default.aspx.cs
//
// Correspondances :
//   txtUserName         → username (useState)
//   txtPassword         → password (useState)
//   lblMessage1.Text    → error (useState)
//   btnOK_Click         → handleLogin()
//   pnlCambioPassword   → showChangePassword (useState)
// ─────────────────────────────────────────────

function LoginPage({ onNavigate }) {
  const { login } = useAuth();

  // Les "states" — comme les propriétés des TextBox et Label en ASP.NET
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Pour le changement de mot de passe obligatoire
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changeMsg, setChangeMsg] = useState("");
  const [changeMsgOk, setChangeMsgOk] = useState(false);

  // useRef = pour "cibler" un élément HTML (comme txtUserName.Focus() en C#)
  const usernameRef = useRef(null);

  // useEffect = code qui s'exécute quand le composant apparaît
  // Ici : on met le focus sur le champ username (comme txtUserName.Focus() dans Page_Load)

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  // ── handleLogin = équivalent de btnOK_Click ──
  const handleLogin = async () => {
    setError("");

    // Vérification champs vides
    // En C# : if (txtUserName.Text.Trim() == string.Empty || txtPassword.Text.Trim() == string.Empty)
    if (!username.trim() || !password.trim()) {
      setError("ENTRER NOM D'UTILISATEUR ET MOT DE PASSE");
      usernameRef.current?.focus();
      return;
    }

    setLoading(true);

    // Appel "API" (mock pour l'instant)
    // En C# : var dic = ClassTools.AutenticazioneDominio(txtUserName.Text.Trim(), txtPassword.Text.Trim());
    const result = await mockLogin(username.trim(), password.trim());

    setLoading(false);

    // Si échec
    // En C# : if (dic.Item1 == false) { lblMessage1.Text = dic.Item2; }
    if (!result.success) {
      setError(result.error);
      return;
    }

    // Vérification mot de passe par défaut → changement obligatoire
    // En C# : if (dic.Item5[0].ToString() == "2" && txtPassword.Text.Trim() == "Riva100!")
    if (password.trim() === "Riva100!") {
      setShowChangePassword(true);
      setChangeMsg("CHANGEMENT DE MOT DE PASSE OBLIGATOIRE");
      return;
    }

    // Tout OK → on connecte et on redirige
    // En C# : Session["S_CognomeNome"] = dic.Item4; Response.Redirect("start.aspx");
    login(result.data);
    onNavigate("home");
  };

  // Changement de mot de passe
  const handleChangePassword = () => {
    setChangeMsg("");
    setChangeMsgOk(false);

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setChangeMsg("VOUS DEVEZ REMPLIR LES DEUX CHAMPS");
      return;
    }
    if (newPassword.trim() === "Riva100!") {
      setChangeMsg("UTILISEZ UN MOT DE PASSE DIFFÉRENT");
      return;
    }
    if (newPassword.trim() !== confirmPassword.trim()) {
      setChangeMsg("LE MOT DE PASSE NE CORRESPOND PAS À LA CONFIRMATION");
      return;
    }

    setChangeMsg("OK, MOT DE PASSE MODIFIÉ");
    setChangeMsgOk(true);
  };

  // Si on appuie sur Entrée dans un champ → ça clique sur OK
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  // ── LE RENDU (ce qui s'affiche) ──
  // En ASP.NET c'était le fichier .aspx (le HTML)
  // En React, le HTML est directement dans le JavaScript (c'est du JSX)
  return (
    <div className="login-container">

      {/* ── Logos en haut ── */}
      <div className="login-logos">
        <span className="logo-riva">RIVA</span>
        <span className="logo-sep">•</span>
        <span className="logo-sam">SAM MONTEREAU</span>
      </div>

      {/* ── Bandeau titre ── */}
      <div className="login-banner">
        RÉSERVATION DE VOITURE
      </div>

      {/* ── Info de test ── */}
      <div className="login-test-info">
        🔑 Pour tester : <strong>test / test</strong> ou <strong>anass.imli / test123</strong>
      </div>

      {/* ── Message d'erreur ── */}
      {error && <div className="login-error">{error}</div>}

      {/* ── Panneau principal ── */}
      <div className="login-main-panel">

        {!showChangePassword ? (
          <>
            {/* ── Texte d'instruction ── */}
            <p className="login-subtitle">
              <em>
                entrez votre nom d'utilisateur et votre mot de passe pour le
                domaine SAM Montereau ou vos identifiants externes
              </em>
            </p>

            {/* ── Formulaire de connexion ── */}
            <div className="login-auth-panel">

              {/* Champ username */}
              <div className="login-field-row">
                <label className="login-label"><em>Nom d'utilisateur:</em></label>
                <span className="login-icon">👤</span>
                <input
                  ref={usernameRef}
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="prénom.nom"
                  className="login-input"
                />
              </div>

              {/* Champ password */}
              <div className="login-field-row">
                <label className="login-label"><em>Mot de passe:</em></label>
                <span className="login-icon">🔒</span>
                <div className="login-password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="mot de passe"
                    className="login-input"
                  />
                  <span
                    className="login-eye"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁"}
                  </span>
                </div>
              </div>

              {/* Bouton OK */}
              <button
                onClick={handleLogin}
                disabled={loading}
                className="login-btn-ok"
              >
                {loading ? "Connexion..." : "OK"}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* ── Panneau changement de mot de passe ── */}
            <div className="login-auth-panel">
              {changeMsg && (
                <p className={changeMsgOk ? "change-msg-ok" : "change-msg-error"}>
                  {changeMsg}
                </p>
              )}

              <div className="login-field-row">
                <label className="login-label"><em>Nouveau mot de passe:</em></label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="login-input"
                />
              </div>

              <div className="login-field-row">
                <label className="login-label"><em>Confirmez le mot de passe:</em></label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="login-input"
                />
              </div>

              <button onClick={handleChangePassword} className="login-btn-ok">
                OK
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── Pied de page ── */}
      <p className="login-footer">
        <em>Groupe Riva — usine SAM Montereau — France — vers. 2.0 React</em>
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// 4. LAYOUT
//
// Reproduit MasterPage.master + MasterPage.master.cs
//
// Correspondances :
//   tmrSecondo_Tick       → useEffect + setInterval (horloge)
//   CaricaMenu()          → tableau menuItems
//   lblWelcome.Text       → user.cognomeNome
//   imbntnLogout_Click    → handleLogout()
//   ContentPlaceHolder    → {children}
// ─────────────────────────────────────────────

function Layout({ children, onNavigate }) {
  const { user, logout } = useAuth();
  const [clock, setClock] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);

  // Horloge temps réel — comme tmrSecondo_Tick
  useEffect(() => {
    const updateClock = () => setClock(new Date().toLocaleString("fr-FR"));
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer); // nettoyage quand le composant disparaît
  }, []);

  // Logout — comme imbntnLogout_Click
  const handleLogout = () => {
    logout();
    onNavigate("login");
  };

  // Structure du menu — comme CaricaMenu() dans MasterPage.master.cs
  const menuItems = [
    {
      label: "PARAMÉTRISATION",
      children: [
        { label: "Marques auto", page: "marques" },
        { label: "Modèles auto", page: "modeles" },
        { label: "Parc auto", page: "parc-auto" },
      ],
    },
    {
      label: "RÉSERVATIONS",
      children: [
        { label: "Nouvelle réservation", page: "reservation-new" },
        { label: "Modifier réservation", page: "reservation-edit" },
      ],
    },
  ];

  return (
    <div className="layout-container">

      {/* ── Header ── */}
      <div className="layout-header">
        <div className="header-row">

          {/* Gauche : horloge */}
          <div className="header-left">
            <span className="header-clock">{clock}</span>
          </div>

          {/* Centre : titre */}
          <div className="header-center">
            <div className="header-subtitle">SAM MONTEREAU</div>
            <div className="header-title">RÉSERVATION DE VOITURE</div>
          </div>

          {/* Droite : user + logout */}
          <div className="header-right">
            <div className="header-user">user: {user?.cognomeNome}</div>
            <div className="header-email">{user?.email}</div>
            <button onClick={handleLogout} className="header-logout-btn">
              🔓 Déconnexion
            </button>
          </div>
        </div>

        {/* ── Barre de menu ── */}
        <div className="menu-bar">
          {menuItems.map((item, i) => (
            <div
              key={i}
              className="menu-parent"
              onMouseEnter={() => setMenuOpen(i)}
              onMouseLeave={() => setMenuOpen(null)}
            >
              <span className="menu-parent-label">{item.label}</span>

              {/* Sous-menu (dropdown) */}
              {menuOpen === i && (
                <div className="menu-dropdown">
                  {item.children.map((child, j) => (
                    <div
                      key={j}
                      className="menu-child"
                      onClick={() => {
                        onNavigate(child.page);
                        setMenuOpen(null);
                      }}
                    >
                      {child.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Contenu de la page (comme ContentPlaceHolder dans MasterPage) ── */}
      <div className="page-content">
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 5. PAGES
// ─────────────────────────────────────────────

// Page d'accueil — reproduit start.aspx
function HomePage() {
  const { user } = useAuth();
  return (
    <div className="page-panel">
      <h2 className="page-title">Bonjour, {user?.cognomeNome}</h2>
      <p className="page-text">
        Bienvenue dans l'application de réservation de voiture.
        <br />
        Utilisez le menu ci-dessus pour naviguer.
      </p>
      <div className="home-status-box">
        <strong>✅ Étape 1 terminée !</strong><br /><br />
        • AuthContext fonctionne (remplace Session ASP.NET)<br />
        • Login fonctionne (remplace Default.aspx)<br />
        • Layout + menu fonctionne (remplace MasterPage.master)<br />
        • Routing fonctionne (remplace Response.Redirect)<br /><br />
        <strong>Prochaine étape :</strong> Page Marques auto (premier CRUD)
      </div>
    </div>
  );
}

// Session expirée — reproduit session_expire.aspx
function SessionExpiredPage({ onNavigate }) {
  return (
    <div className="expired-container">
      <h2 className="expired-title">SESSION EXPIRÉ</h2>
      <p className="expired-text">
        Vous avez laissé une page inactive ouverte pendant plus de 120 minutes.
      </p>
      <button onClick={() => onNavigate("login")} className="login-btn-ok">
        Retour à la page d'accueil
      </button>
    </div>
  );
}

// Pages placeholder (on les codera dans les prochaines étapes)
function PlaceholderPage({ title }) {
  return (
    <div className="page-panel">
      <h2 className="page-title">{title}</h2>
      <p className="page-text">🚧 Cette page sera créée dans une prochaine étape.</p>
    </div>
  );
}

// ─────────────────────────────────────────────
// 6. APP PRINCIPAL — Le "chef d'orchestre"
//
// Gère quelle page afficher.
//
// En ASP.NET : Response.Redirect("start.aspx")
// En React   : setPage("home")
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// PAGE MODÈLES AUTO
//
// Reproduit par_modelli.aspx + par_modelli.aspx.cs
//
// Correspondances :
//   dgwModelli (GridView)         → tableau HTML avec modeles.map()
//   ddlMarche (DropDownList)      → <select> avec marques.map()
//   txtModello (TextBox)          → newModele (useState)
//   txtCilindrata (TextBox)       → newCilindrata (useState)
//   btnInserimento_Click          → handleInsert()
//   btnEliminaModello_Click       → handleDelete()
//   dgwModelli_SelectedIndexChanging → click sur SEL.
//   PopolaMarche()                → on réutilise MOCK_MARQUES_INITIAL
//   CaricaModelli()               → loadModeles() (simulated)
//
// CONCEPT REACT IMPORTANT : <select> contrôlé
//   En ASP.NET :
//     ddlMarche.DataSource = ds;
//     ddlMarche.DataTextField = "Marca";
//     ddlMarche.DataValueField = "IdMarca";
//     ddlMarche.DataBind();
//
//   En React :
//     <select value={selectedMarca} onChange={(e) => setSelectedMarca(e.target.value)}>
//       {marques.map((m) => <option key={m.IdMarca} value={m.IdMarca}>{m.Marca}</option>)}
//     </select>
//
//   C'est la même logique : on parcourt la liste et on crée les <option>
// ─────────────────────────────────────────────

// Données mock — simule ff_get_modelli
const MOCK_MODELES_INITIAL = [
  { IdModello: 1, IdMarca: 1, Marca: "RENAULT", Modello: "CLIO", Cilindrata: 1200 },
  { IdModello: 2, IdMarca: 1, Marca: "RENAULT", Modello: "MEGANE", Cilindrata: 1500 },
  { IdModello: 3, IdMarca: 2, Marca: "PEUGEOT", Modello: "208", Cilindrata: 1200 },
  { IdModello: 4, IdMarca: 2, Marca: "PEUGEOT", Modello: "308", Cilindrata: 1600 },
  { IdModello: 5, IdMarca: 3, Marca: "CITROEN", Modello: "C3", Cilindrata: 1200 },
  { IdModello: 6, IdMarca: 4, Marca: "DACIA", Modello: "SANDERO", Cilindrata: 1000 },
  { IdModello: 7, IdMarca: 5, Marca: "FIAT", Modello: "500", Cilindrata: 900 },
];

function ModelesPage() {
  // ── States ──

  // Liste des modèles
  const [modeles, setModeles] = useState(MOCK_MODELES_INITIAL);

  // Liste des marques (pour la DropDownList)
  // On réutilise les mêmes données mock que la page Marques
  const [marques] = useState(MOCK_MARQUES_INITIAL);

  // Champs du formulaire
  const [selectedMarca, setSelectedMarca] = useState("0"); // comme ddlMarche.SelectedValue
  const [newModele, setNewModele] = useState("");            // comme txtModello.Text
  const [newCilindrata, setNewCilindrata] = useState("");    // comme txtCilindrata.Text

  // Message + sélection
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // ── handleInsert = équivalent de btnInserimento_Click ──
  //
  // En C# :
  //   if (ddlMarche.SelectedValue == "0") { lblMessage.Text = "SCEGLI LA MARCA"; }
  //   else {
  //       htValues["IdMarca"] = int.Parse(ddlMarche.SelectedValue);
  //       htValues["Modello"] = txtModello.Text.Trim().ToUpper();
  //       ConfigurationHelper.DBHelper.DoJob("insert_modello", htValues);
  //   }
  //
  const handleInsert = () => {
    setMessage("");

    // Vérification : marque sélectionnée ?
    if (selectedMarca === "0") {
      setMessage("CHOISISSEZ UNE MARQUE");
      setMessageType("error");
      return;
    }

    // Vérification : modèle rempli ?
    if (!newModele.trim()) {
      setMessage("ENTREZ UN NOM DE MODÈLE");
      setMessageType("error");
      return;
    }

    if (selectedId) {
      // ── Mode modification ──
      setModeles(modeles.map((m) => {
        if (m.IdModello === selectedId) {
          const marque = marques.find((ma) => ma.IdMarca === parseInt(selectedMarca));
          return {
            ...m, // garde les anciennes valeurs
            IdMarca: parseInt(selectedMarca),
            Marca: marque ? marque.Marca : m.Marca,
            Modello: newModele.trim().toUpperCase(),
            Cilindrata: newCilindrata.trim() ? parseInt(newCilindrata) : null,
          };
        }
        return m;
      }));
      setMessage("MODÈLE MIS À JOUR");
      setMessageType("success");
    } else {
      // ── Mode insertion ──
      const newId = modeles.length > 0 ? Math.max(...modeles.map((m) => m.IdModello)) + 1 : 1;
      const marque = marques.find((m) => m.IdMarca === parseInt(selectedMarca));

      const nouveauModele = {
        IdModello: newId,
        IdMarca: parseInt(selectedMarca),
        Marca: marque ? marque.Marca : "?",
        Modello: newModele.trim().toUpperCase(),
        Cilindrata: newCilindrata.trim() ? parseInt(newCilindrata) : null,
      };

      setModeles([...modeles, nouveauModele]);
      setMessage("MODÈLE AJOUTÉ AVEC SUCCÈS");
      setMessageType("success");
    }

    // Nettoyage des champs
    resetForm();
  };

  // ── handleDelete = équivalent de btnEliminaModello_Click ──
  const handleDelete = () => {
    if (selectedId === null) return;

    setModeles(modeles.filter((m) => m.IdModello !== selectedId));
    setMessage("MODÈLE SUPPRIMÉ");
    setMessageType("success");
    resetForm();
  };

  // ── handleSelect = équivalent de dgwModelli_SelectedIndexChanging ──
  //
  // En C# :
  //   lblIdSelezionato.Text = dgwModelli.Rows[e.NewSelectedIndex].Cells[1].Text;
  //   ddlMarche.SelectedIndex = ...;
  //   txtModello.Text = records[0].FieldList["Modello"].Value.ToString();
  //
  const handleSelect = (modele) => {
    setSelectedId(modele.IdModello);
    setSelectedMarca(modele.IdMarca.toString());
    setNewModele(modele.Modello);
    setNewCilindrata(modele.Cilindrata ? modele.Cilindrata.toString() : "");
    setMessage("");
  };

  // Nettoyer le formulaire
  const resetForm = () => {
    setSelectedId(null);
    setSelectedMarca("0");
    setNewModele("");
    setNewCilindrata("");
  };

  // ── Rendu ──
  return (
    <div className="page-panel">
      <h2 className="marques-title">MODÈLES AUTO</h2>

      {message && (
        <div className={messageType === "error" ? "marques-msg-error" : "marques-msg-success"}>
          {message}
        </div>
      )}

      <div className="marques-layout">

        {/* ── GAUCHE : Tableau des modèles ── */}
        <div className="marques-table-container" style={{ maxHeight: 450 }}>
          <table className="marques-table">
            <thead>
              <tr>
                <th style={{ width: 50 }}>SEL.</th>
                <th style={{ width: 40 }}>ID</th>
                <th>MARQUE</th>
                <th>MODÈLE</th>
                <th>CYLINDRÉE</th>
              </tr>
            </thead>
            <tbody>
              {modeles.map((m) => (
                <tr
                  key={m.IdModello}
                  className={selectedId === m.IdModello ? "row-selected" : ""}
                >
                  <td>
                    <button className="btn-select" onClick={() => handleSelect(m)}>
                      SEL.
                    </button>
                  </td>
                  <td>{m.IdModello}</td>
                  <td>{m.Marca}</td>
                  <td style={{ textAlign: "left", paddingLeft: 12 }}>{m.Modello}</td>
                  <td>{m.Cilindrata || "—"}</td>
                </tr>
              ))}
              {modeles.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ color: "#999", padding: 20 }}>
                    Aucun modèle
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── DROITE : Formulaire ── */}
        <div className="marques-form" style={{ minWidth: 350 }}>

          {/* DropDownList des marques — comme ddlMarche */}
          <div className="marques-form-row">
            <label className="marques-form-label"><strong>MARQUE:</strong></label>
            {/*
              En ASP.NET :
                ddlMarche.DataSource = ds;
                ddlMarche.DataTextField = "Marca";
                ddlMarche.DataValueField = "IdMarca";
                ddlMarche.DataBind();
                ListItem li = new ListItem("Scegli...", "0");
                ddlMarche.Items.Insert(0, li);

              En React : c'est le <select> ci-dessous
            */}
            <select
              value={selectedMarca}
              onChange={(e) => setSelectedMarca(e.target.value)}
              className="modeles-select"
            >
              <option value="0">Choisir...</option>
              {marques.map((m) => (
                <option key={m.IdMarca} value={m.IdMarca}>
                  {m.Marca}
                </option>
              ))}
            </select>
          </div>

          {/* Champ modèle */}
          <div className="marques-form-row">
            <label className="marques-form-label"><strong>MODÈLE:</strong></label>
            <input
              type="text"
              value={newModele}
              onChange={(e) => setNewModele(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleInsert(); }}
              className="marques-form-input"
              placeholder="Nom du modèle"
            />
          </div>

          {/* Champ cylindrée */}
          <div className="marques-form-row">
            <label className="marques-form-label"><strong>CYLINDRÉE:</strong></label>
            <input
              type="number"
              value={newCilindrata}
              onChange={(e) => setNewCilindrata(e.target.value)}
              className="marques-form-input"
              placeholder="ex: 1200"
            />
          </div>

          {/* Boutons */}
          <div className="marques-form-buttons">
            {selectedId && (
              <button onClick={() => resetForm()} className="btn-cancel" style={{ marginBottom: 4 }}>
                ↩ Retour insertion
              </button>
            )}

            <button onClick={handleInsert} className="btn-insert">
              {selectedId ? "METTRE À JOUR MODÈLE" : "INSÉRER MODÈLE"}
            </button>

            {selectedId && (
              <button onClick={handleDelete} className="btn-delete">
                SUPPRIMER MODÈLE
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────
// PAGE PARC AUTO (FLOTTE)
//
// Reproduit par_auto.aspx + par_auto.aspx.cs
//
// Correspondances :
//   g_flotta (GridView)            → tableau HTML avec voitures.map()
//   ddl_modello (DropDownList)     → <select> avec "Marca - Modello"
//   txt_targa (TextBox)            → newTarga (useState)
//   txt_prezzo (TextBox)           → newPrezzo (useState)
//   txt_anno (TextBox)             → newAnno (useState)
//   chk_disponibilita (CheckBox)   → newRottamato (useState) — checkbox
//   btn_operazione_Click           → handleInsert()
//   PopolaTabella()                → données mock voitures
//   PopolaModelli()                → données mock modèles avec "Marca - Modello"
//
//   Couleurs vert/rouge pour Rottamato :
//   En C# :
//     if (rottamato == 0) { Cells[5].BackColor = Color.Green; Cells[5].Text = "NO"; }
//     else { Cells[5].BackColor = Color.Red; Cells[5].Text = "SI"; }
//
//   En React :
//     <td style={{ background: v.Rottamato ? "#cc0000" : "#008800" }}>
//       {v.Rottamato ? "OUI" : "NON"}
//     </td>
// ─────────────────────────────────────────────

// Données mock — simule ce que retourne ff_get_auto avec les jointures
const MOCK_VOITURES_INITIAL = [
  { IdAuto: 1, IdModello: 1, Marca: "RENAULT", Modello: "CLIO", Targa: "AB-123-CD", Rottamato: 0, Priorite: "R" },
  { IdAuto: 2, IdModello: 2, Marca: "RENAULT", Modello: "MEGANE", Targa: "EF-456-GH", Rottamato: 0, Priorite: "R" },
  { IdAuto: 3, IdModello: 3, Marca: "PEUGEOT", Modello: "208", Targa: "IJ-789-KL", Rottamato: 0, Priorite: "F" },
  { IdAuto: 4, IdModello: 4, Marca: "PEUGEOT", Modello: "308", Targa: "MN-012-OP", Rottamato: 1, Priorite: "R" },
  { IdAuto: 5, IdModello: 5, Marca: "CITROEN", Modello: "C3", Targa: "QR-345-ST", Rottamato: 0, Priorite: "T" },
  { IdAuto: 6, IdModello: 6, Marca: "DACIA", Modello: "SANDERO", Targa: "UV-678-WX", Rottamato: 0, Priorite: "R" },
  { IdAuto: 7, IdModello: 7, Marca: "FIAT", Modello: "500", Targa: "YZ-901-AB", Rottamato: 1, Priorite: "F" },
];

function ParcAutoPage() {
  // ── States ──
  const [voitures, setVoitures] = useState(MOCK_VOITURES_INITIAL);
  const [modeles] = useState(MOCK_MODELES_INITIAL); // réutilise les modèles mock

  // Champs du formulaire
  const [selectedModello, setSelectedModello] = useState("0"); // ddl_modello
  const [newTarga, setNewTarga] = useState("");                 // txt_targa
  const [newPrezzo, setNewPrezzo] = useState("");               // txt_prezzo
  const [newAnno, setNewAnno] = useState("");                   // txt_anno
  const [newRottamato, setNewRottamato] = useState(false);      // chk_disponibilita
  const [newPriorite, setNewPriorite] = useState("R");          // priorité

  // Message + sélection
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // ── handleInsert = équivalent de btn_operazione_Click ──
  //
  // En C# :
  //   htValues["IdModello"] = int.Parse(ddl_modello.SelectedValue);
  //   htValues["Targa"] = txt_targa.Text.ToUpper().Trim();
  //   htValues["Rottamato"] = chk_disponibilita.Checked ? 1 : 0;
  //   ConfigurationHelper.DBHelper.DoJob("insert_auto", htValues);
  //
  const handleInsert = () => {
    setMessage("");

    if (selectedModello === "0") {
      setMessage("CHOISISSEZ UN MODÈLE");
      setMessageType("error");
      return;
    }

    if (!newTarga.trim()) {
      setMessage("ENTREZ UNE PLAQUE D'IMMATRICULATION");
      setMessageType("error");
      return;
    }

    // Trouver le modèle sélectionné pour récupérer marque + modèle
    const modele = modeles.find((m) => m.IdModello === parseInt(selectedModello));

    if (selectedId) {
      // ── Mode modification ──
      setVoitures(voitures.map((v) => {
        if (v.IdAuto === selectedId) {
          return {
            ...v,
            IdModello: parseInt(selectedModello),
            Marca: modele ? modele.Marca : v.Marca,
            Modello: modele ? modele.Modello : v.Modello,
            Targa: newTarga.trim().toUpperCase(),
            Rottamato: newRottamato ? 1 : 0,
            Priorite: newPriorite,
          };
        }
        return v;
      }));
      setMessage("VOITURE MISE À JOUR");
      setMessageType("success");
    } else {
      // ── Mode insertion ──
      const newId = voitures.length > 0 ? Math.max(...voitures.map((v) => v.IdAuto)) + 1 : 1;

      const nouvelleVoiture = {
        IdAuto: newId,
        IdModello: parseInt(selectedModello),
        Marca: modele ? modele.Marca : "?",
        Modello: modele ? modele.Modello : "?",
        Targa: newTarga.trim().toUpperCase(),
        Rottamato: newRottamato ? 1 : 0,
        Priorite: newPriorite,
      };

      setVoitures([...voitures, nouvelleVoiture]);
      setMessage("VOITURE AJOUTÉE AVEC SUCCÈS");
      setMessageType("success");
    }

    resetForm();
  };

  // ── Sélection d'une voiture dans le tableau ──
  const handleSelect = (voiture) => {
    setSelectedId(voiture.IdAuto);
    setSelectedModello(voiture.IdModello.toString());
    setNewTarga(voiture.Targa);
    setNewPrezzo("");
    setNewAnno("");
    setNewRottamato(voiture.Rottamato === 1);
    setNewPriorite(voiture.Priorite || "R");
    setMessage("");
  };

  // ── Suppression ──
  const handleDelete = () => {
    if (selectedId === null) return;
    setVoitures(voitures.filter((v) => v.IdAuto !== selectedId));
    setMessage("VOITURE SUPPRIMÉE");
    setMessageType("success");
    resetForm();
  };

  const resetForm = () => {
    setSelectedId(null);
    setSelectedModello("0");
    setNewTarga("");
    setNewPrezzo("");
    setNewAnno("");
    setNewRottamato(false);
    setNewPriorite("R");
  };

  // ── Rendu ──
  return (
    <div className="page-panel">
      <h2 className="marques-title">PARC AUTO</h2>

      {message && (
        <div className={messageType === "error" ? "marques-msg-error" : "marques-msg-success"}>
          {message}
        </div>
      )}

      <div className="marques-layout">

        {/* ── GAUCHE : Tableau de la flotte ── */}
        <div className="marques-table-container" style={{ maxHeight: 500 }}>
          <table className="marques-table">
            <thead>
              <tr>
                <th style={{ width: 50 }}>SEL.</th>
                <th style={{ width: 40 }}>ID</th>
                <th>MARQUE</th>
                <th>MODÈLE</th>
                <th>PLAQUE</th>
                <th style={{ width: 80 }}>PRIORITÉ</th>
                <th style={{ width: 100 }}>HORS SERVICE</th>
              </tr>
            </thead>
            <tbody>
              {voitures.map((v) => (
                <tr
                  key={v.IdAuto}
                  className={selectedId === v.IdAuto ? "row-selected" : ""}
                >
                  <td>
                    <button className="btn-select" onClick={() => handleSelect(v)}>
                      SEL.
                    </button>
                  </td>
                  <td>{v.IdAuto}</td>
                  <td>{v.Marca}</td>
                  <td style={{ textAlign: "left", paddingLeft: 12 }}>{v.Modello}</td>
                  <td><strong>{v.Targa}</strong></td>
                  <td>
                    <span className={"priorite-badge priorite-" + (v.Priorite || "R").toLowerCase()}>
                      {v.Priorite === "R" ? "Riva" : v.Priorite === "F" ? "Formation" : v.Priorite === "T" ? "Transport" : v.Priorite}
                    </span>
                  </td>
                  {/*
                    Couleur vert/rouge — comme ton code C# :
                    if (rottamato == 0) { BackColor = Color.Green; Text = "NO"; }
                    else { BackColor = Color.Red; Text = "SI"; }
                  */}
                  <td
                    style={{
                      background: v.Rottamato === 1 ? "#cc0000" : "#008800",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  >
                    {v.Rottamato === 1 ? "OUI" : "NON"}
                  </td>
                </tr>
              ))}
              {voitures.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ color: "#999", padding: 20 }}>
                    Aucune voiture
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── DROITE : Formulaire ── */}
        <div className="marques-form" style={{ minWidth: 360 }}>

          {/* Dropdown modèle — comme ddl_modello avec "Marca - Modello" */}
          <div className="marques-form-row">
            <label className="marques-form-label"><strong>Modèle:</strong></label>
            {/*
              En C# :
                ds.Tables[0].Columns.Add("FullName", typeof(string), "Marca + ' - ' + Modello");
                ddl_modello.DataTextField = "FullName";
              En React : on affiche "Marca - Modello" dans chaque <option>
            */}
            <select
              value={selectedModello}
              onChange={(e) => setSelectedModello(e.target.value)}
              className="modeles-select"
              style={{ width: 230 }}
            >
              <option value="0">Choisir...</option>
              {modeles.map((m) => (
                <option key={m.IdModello} value={m.IdModello}>
                  {m.Marca} - {m.Modello}
                </option>
              ))}
            </select>
          </div>

          {/* Plaque */}
          <div className="marques-form-row">
            <label className="marques-form-label"><strong>Plaque:</strong></label>
            <input
              type="text"
              value={newTarga}
              onChange={(e) => setNewTarga(e.target.value)}
              className="marques-form-input"
              style={{ width: 230 }}
              placeholder="ex: AB-123-CD"
            />
          </div>

          {/* Priorité */}
          <div className="marques-form-row">
            <label className="marques-form-label"><strong>Priorité:</strong></label>
            <select
              value={newPriorite}
              onChange={(e) => setNewPriorite(e.target.value)}
              className="modeles-select"
              style={{ width: 230 }}
            >
              <option value="R">Usine Riva</option>
              <option value="F">Formation</option>
              <option value="T">Transport</option>
            </select>
          </div>

          {/* Checkbox hors service — comme chk_disponibilita */}
          <div className="marques-form-row">
            <label className="marques-form-label"><strong>Hors service:</strong></label>
            {/*
              En ASP.NET :
                <asp:CheckBox ID="chk_disponibilita" runat="server" />
                if (chk_disponibilita.Checked) htValues["Rottamato"] = 1;

              En React :
                <input type="checkbox" checked={newRottamato} onChange={...} />
                Rottamato: newRottamato ? 1 : 0
            */}
            <div className="parc-checkbox-wrapper">
              <input
                type="checkbox"
                checked={newRottamato}
                onChange={(e) => setNewRottamato(e.target.checked)}
                className="parc-checkbox"
                id="chkRottamato"
              />
              <label htmlFor="chkRottamato" className="parc-checkbox-label">
                {newRottamato ? "OUI — véhicule hors service" : "NON — véhicule disponible"}
              </label>
            </div>
          </div>

          {/* Boutons */}
          <div className="marques-form-buttons" style={{ marginTop: 8 }}>
            {selectedId && (
              <button onClick={resetForm} className="btn-cancel" style={{ marginBottom: 4 }}>
                ↩ Retour insertion
              </button>
            )}

            <button onClick={handleInsert} className="btn-insert">
              {selectedId ? "METTRE À JOUR" : "INSÉRER VOITURE"}
            </button>

            {selectedId && (
              <button onClick={handleDelete} className="btn-delete">
                SUPPRIMER VOITURE
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PAGE NOUVELLE RÉSERVATION
//
// Reproduit la logique de ai_insert_reservation
//
// C'est la page la plus complète. Tu vas apprendre :
//   - Champs date (input type="date")
//   - Calcul automatique (nombre de jours)
//   - Liste dynamique (voyageurs : ajouter/supprimer)
//   - Radio buttons (type de destination)
//   - Filtrage de liste (voitures par priorité)
//
// Correspondances avec ta stored procedure ai_insert_reservation :
//   @UtentePrenotazione     → user.cognomeNome (depuis AuthContext)
//   @ProgressivoPrenotazione → calculé automatiquement
//   @AnnoPrenotazione       → année en cours
//   @DataInizio             → dateDebut
//   @DataFine               → dateFin
//   @Giorni                 → calculé automatiquement (dateFin - dateDebut)
//   @KmEstime               → kmEstime
//   @Destinazione           → destination
//   @UsineRiva              → usineRiva (radio button)
//   @GuidTable              → généré automatiquement
//   @IdAuto                 → selectedVoiture
//
// Table utVoyagers :
//   @GuidTable + @Voyager   → liste dynamique de voyageurs
// ─────────────────────────────────────────────

function NewReservationPage() {
  const { user } = useAuth();

  // ── States du formulaire ──
  const [selectedVoiture, setSelectedVoiture] = useState("0");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [destination, setDestination] = useState("");
  const [usineRiva, setUsineRiva] = useState("N"); // O = oui usine Riva, N = non
  const [kmEstime, setKmEstime] = useState("");

  // Liste des voyageurs — c'est un TABLEAU dans le state
  // En C# tu insérais dans utVoyagers avec un GuidTable
  // En React on gère un tableau qu'on envoie au backend d'un coup
  const [voyageurs, setVoyageurs] = useState([""]);
  const [newVoyageur, setNewVoyageur] = useState("");

  // Messages
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Données mock voitures (filtrées selon le type)
  const [voitures] = useState(MOCK_VOITURES_INITIAL.filter((v) => v.Rottamato === 0));

  // Réservations déjà faites (mock)
  const [reservations, setReservations] = useState([]);

  // ── Calcul automatique du nombre de jours ──
  //
  // useEffect : "quand dateDebut ou dateFin change, recalcule les jours"
  // C'est comme si en ASP.NET tu avais un événement OnTextChanged
  //
  const [nbJours, setNbJours] = useState(0);

  useEffect(() => {
    if (dateDebut && dateFin) {
      const d1 = new Date(dateDebut);
      const d2 = new Date(dateFin);
      const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
      setNbJours(diff >= 0 ? diff + 1 : 0);
    } else {
      setNbJours(0);
    }
  }, [dateDebut, dateFin]);

  // ── Ajouter un voyageur à la liste ──
  const handleAddVoyageur = () => {
    if (!newVoyageur.trim()) return;

    // On vérifie qu'il n'est pas déjà dans la liste
    if (voyageurs.some((v) => v.toLowerCase() === newVoyageur.trim().toLowerCase())) {
      setMessage("CE VOYAGEUR EST DÉJÀ DANS LA LISTE");
      setMessageType("error");
      return;
    }

    // Ajouter : on crée un nouveau tableau avec l'ancien + le nouveau
    setVoyageurs([...voyageurs.filter((v) => v !== ""), newVoyageur.trim()]);
    setNewVoyageur("");
    setMessage("");
  };

  // ── Supprimer un voyageur de la liste ──
  // filter() = garder tous sauf celui à l'index donné
  const handleRemoveVoyageur = (index) => {
    setVoyageurs(voyageurs.filter((_, i) => i !== index));
  };

  // ── Soumettre la réservation ──
  //
  // Équivalent de l'appel à ai_insert_reservation
  //
  const handleSubmit = () => {
    setMessage("");

    // ── Validations ──
    if (selectedVoiture === "0") {
      setMessage("CHOISISSEZ UNE VOITURE");
      setMessageType("error");
      return;
    }
    if (!dateDebut) {
      setMessage("ENTREZ LA DATE DE DÉBUT");
      setMessageType("error");
      return;
    }
    if (!dateFin) {
      setMessage("ENTREZ LA DATE DE FIN");
      setMessageType("error");
      return;
    }
    if (new Date(dateFin) < new Date(dateDebut)) {
      setMessage("LA DATE DE FIN DOIT ÊTRE APRÈS LA DATE DE DÉBUT");
      setMessageType("error");
      return;
    }
    if (!destination.trim()) {
      setMessage("ENTREZ UNE DESTINATION");
      setMessageType("error");
      return;
    }

    // ── Vérification de disponibilité ──
    // On vérifie que la voiture n'est pas déjà réservée sur ces dates
    const voitureId = parseInt(selectedVoiture);
    const conflit = reservations.find((r) => {
      if (r.IdAuto !== voitureId) return false;
      const rDebut = new Date(r.DataInizio);
      const rFin = new Date(r.DataFine);
      const nDebut = new Date(dateDebut);
      const nFin = new Date(dateFin);
      return nDebut <= rFin && nFin >= rDebut;
    });

    if (conflit) {
      setMessage("CETTE VOITURE EST DÉJÀ RÉSERVÉE SUR CETTE PÉRIODE");
      setMessageType("error");
      return;
    }

    // ── Créer la réservation ──
    // Simule l'appel à ai_insert_reservation
    const voiture = voitures.find((v) => v.IdAuto === voitureId);
    const guidTable = "GT" + Date.now().toString().slice(-8); // GUID simplifié

    const nouvelleReservation = {
      IdPrenotazione: reservations.length + 1,
      IdAuto: voitureId,
      Marca: voiture ? voiture.Marca : "?",
      Modello: voiture ? voiture.Modello : "?",
      Targa: voiture ? voiture.Targa : "?",
      UtentePrenotazione: user?.cognomeNome || "?",
      ProgressivoPrenotazione: reservations.length + 1,
      AnnoPrenotazione: new Date().getFullYear(),
      DataInizio: dateDebut,
      DataFine: dateFin,
      Giorni: nbJours,
      KmEstime: kmEstime ? parseInt(kmEstime) : 0,
      Destinazione: destination.trim(),
      UsineRiva: usineRiva,
      GuidTable: guidTable,
      Voyageurs: voyageurs.filter((v) => v !== ""),
      InsertData: new Date().toLocaleString("fr-FR"),
    };

    setReservations([...reservations, nouvelleReservation]);

    // Nettoyage
    setSelectedVoiture("0");
    setDateDebut("");
    setDateFin("");
    setDestination("");
    setUsineRiva("N");
    setKmEstime("");
    setVoyageurs([""]);
    setNewVoyageur("");

    setMessage("✅ RÉSERVATION N° " + nouvelleReservation.ProgressivoPrenotazione + "/" + nouvelleReservation.AnnoPrenotazione + " CRÉÉE AVEC SUCCÈS");
    setMessageType("success");
  };

  // Date d'aujourd'hui au format YYYY-MM-DD (pour le min des champs date)
  const today = new Date().toISOString().split("T")[0];

  // ── Rendu ──
  return (
    <div className="page-panel" style={{ textAlign: "left" }}>
      <h2 className="marques-title">NOUVELLE RÉSERVATION</h2>

      {message && (
        <div className={messageType === "error" ? "marques-msg-error" : "marques-msg-success"}>
          {message}
        </div>
      )}

      <div className="resa-layout">

        {/* ══════ COLONNE GAUCHE : Formulaire ══════ */}
        <div className="resa-form">

          {/* Utilisateur (automatique depuis AuthContext) */}
          <div className="resa-row">
            <label className="resa-label">Demandeur :</label>
            <span className="resa-value">{user?.cognomeNome}</span>
          </div>

          {/* Type de destination — Radio buttons */}
          <div className="resa-row">
            <label className="resa-label">Destination :</label>
            {/*
              En ASP.NET tu avais un champ UsineRiva (char).
              En React on utilise des radio buttons.
              Quand tu cliques, ça change le state usineRiva.
            */}
            <div className="resa-radio-group">
              <label className="resa-radio">
                <input
                  type="radio"
                  name="usineRiva"
                  value="O"
                  checked={usineRiva === "O"}
                  onChange={(e) => setUsineRiva(e.target.value)}
                />
                Usine Riva
              </label>
              <label className="resa-radio">
                <input
                  type="radio"
                  name="usineRiva"
                  value="N"
                  checked={usineRiva === "N"}
                  onChange={(e) => setUsineRiva(e.target.value)}
                />
                Autre destination
              </label>
            </div>
          </div>

          {/* Lieu de destination */}
          <div className="resa-row">
            <label className="resa-label">Lieu :</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="resa-input"
              placeholder="ex: SAM Montereau, Paris, Lyon..."
            />
          </div>

          {/* Sélection voiture */}
          <div className="resa-row">
            <label className="resa-label">Voiture :</label>
            <select
              value={selectedVoiture}
              onChange={(e) => setSelectedVoiture(e.target.value)}
              className="resa-select"
            >
              <option value="0">Choisir une voiture...</option>
              {voitures.map((v) => (
                <option key={v.IdAuto} value={v.IdAuto}>
                  {v.Marca} {v.Modello} — {v.Targa}
                </option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div className="resa-row">
            <label className="resa-label">Date début :</label>
            <input
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              min={today}
              className="resa-input-date"
            />
          </div>

          <div className="resa-row">
            <label className="resa-label">Date fin :</label>
            <input
              type="date"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
              min={dateDebut || today}
              className="resa-input-date"
            />
          </div>

          {/* Nombre de jours (calculé automatiquement) */}
          <div className="resa-row">
            <label className="resa-label">Nombre de jours :</label>
            <span className="resa-jours">{nbJours > 0 ? nbJours + " jour(s)" : "—"}</span>
          </div>

          {/* Km estimé */}
          <div className="resa-row">
            <label className="resa-label">Km estimé :</label>
            <input
              type="number"
              value={kmEstime}
              onChange={(e) => setKmEstime(e.target.value)}
              className="resa-input"
              style={{ width: 120 }}
              placeholder="ex: 150"
            />
          </div>

          {/* ── VOYAGEURS ── */}
          <div className="resa-voyageurs-section">
            <label className="resa-label" style={{ marginBottom: 8, display: "block" }}>
              <strong>Voyageurs :</strong>
            </label>

            {/* Liste des voyageurs ajoutés */}
            {voyageurs.filter((v) => v !== "").length > 0 && (
              <div className="resa-voyageurs-list">
                {voyageurs.filter((v) => v !== "").map((v, i) => (
                  <div key={i} className="resa-voyageur-item">
                    <span>👤 {v}</span>
                    <button
                      onClick={() => handleRemoveVoyageur(i)}
                      className="resa-voyageur-remove"
                      title="Supprimer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Champ pour ajouter un voyageur */}
            <div className="resa-voyageur-add">
              <input
                type="text"
                value={newVoyageur}
                onChange={(e) => setNewVoyageur(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddVoyageur(); } }}
                className="resa-input"
                placeholder="Nom du voyageur"
                style={{ flex: 1 }}
              />
              <button onClick={handleAddVoyageur} className="btn-add-voyageur">
                + Ajouter
              </button>
            </div>
          </div>

          {/* ── Bouton SOUMETTRE ── */}
          <div style={{ marginTop: 24, textAlign: "center" }}>
            <button onClick={handleSubmit} className="btn-submit-resa">
              CRÉER LA RÉSERVATION
            </button>
          </div>
        </div>

        {/* ══════ COLONNE DROITE : Réservations créées ══════ */}
        <div className="resa-list">
          <h3 className="resa-list-title">Réservations créées</h3>

          {reservations.length === 0 ? (
            <p style={{ color: "#999", fontSize: 13, textAlign: "center", marginTop: 20 }}>
              Aucune réservation pour le moment
            </p>
          ) : (
            reservations.map((r) => (
              <div key={r.IdPrenotazione} className="resa-card">
                <div className="resa-card-header">
                  Réservation N° {r.ProgressivoPrenotazione}/{r.AnnoPrenotazione}
                </div>
                <div className="resa-card-body">
                  <div><strong>Voiture :</strong> {r.Marca} {r.Modello} — {r.Targa}</div>
                  <div><strong>Du :</strong> {r.DataInizio} <strong>au</strong> {r.DataFine} ({r.Giorni} jour{r.Giorni > 1 ? "s" : ""})</div>
                  <div><strong>Destination :</strong> {r.Destinazione} {r.UsineRiva === "O" ? "(Usine Riva)" : ""}</div>
                  <div><strong>Km estimé :</strong> {r.KmEstime || "—"}</div>
                  {r.Voyageurs.length > 0 && (
                    <div><strong>Voyageurs :</strong> {r.Voyageurs.join(", ")}</div>
                  )}
                  <div className="resa-card-date">Créée le {r.InsertData}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PAGE MODIFIER RÉSERVATION
//
// Affiche toutes les réservations dans un tableau.
// On peut voir les détails, modifier ou supprimer.
//
// Concept React important : données mock pour simuler
// Plus tard, cette page appellera ta stored procedure
// ai_get_reservation_complete pour charger les vraies données.
//
// NOUVEAU CONCEPT : "état d'affichage" (viewMode)
//   On utilise un state pour savoir si on est en mode :
//   - "list"   → on voit le tableau
//   - "detail" → on voit le détail d'une réservation
//   - "edit"   → on modifie une réservation
//   C'est comme avoir plusieurs Panel en ASP.NET
//   avec Panel1.Visible = true; Panel2.Visible = false;
// ─────────────────────────────────────────────

// Réservations mock — simule ai_get_reservation_complete
const MOCK_RESERVATIONS = [
  {
    IdPrenotazione: 1,
    IdAuto: 1,
    Marca: "RENAULT",
    Modello: "CLIO",
    Targa: "AB-123-CD",
    UtentePrenotazione: "IMLI Anass",
    Guidatore: "IMLI Anass",
    ProgressivoPrenotazione: 1,
    AnnoPrenotazione: 2026,
    DataInizio: "2026-04-15",
    DataFine: "2026-04-17",
    Giorni: 3,
    KmEstime: 200,
    Destinazione: "Paris",
    UsineRiva: "N",
    ValidationRH: 0,
    Voyageurs: ["DUPONT Jean", "MARTIN Pierre"],
    InsertData: "09/04/2026 14:30",
  },
  {
    IdPrenotazione: 2,
    IdAuto: 3,
    Marca: "PEUGEOT",
    Modello: "208",
    Targa: "IJ-789-KL",
    UtentePrenotazione: "COPPOLA Manlio",
    Guidatore: "COPPOLA Manlio",
    ProgressivoPrenotazione: 2,
    AnnoPrenotazione: 2026,
    DataInizio: "2026-04-20",
    DataFine: "2026-04-20",
    Giorni: 1,
    KmEstime: 50,
    Destinazione: "SAM Montereau",
    UsineRiva: "O",
    ValidationRH: 1,
    Voyageurs: [],
    InsertData: "09/04/2026 15:00",
  },
  {
    IdPrenotazione: 3,
    IdAuto: 6,
    Marca: "DACIA",
    Modello: "SANDERO",
    Targa: "UV-678-WX",
    UtentePrenotazione: "IMLI Anass",
    Guidatore: "KORNAK Didier",
    ProgressivoPrenotazione: 3,
    AnnoPrenotazione: 2026,
    DataInizio: "2026-05-01",
    DataFine: "2026-05-03",
    Giorni: 3,
    KmEstime: 350,
    Destinazione: "Lyon",
    UsineRiva: "N",
    ValidationRH: 0,
    Voyageurs: ["KORNAK Didier", "IMLI Anass", "BERNARD Sophie"],
    InsertData: "10/04/2026 09:15",
  },
];

function EditReservationPage() {
  const [reservations, setReservations] = useState(MOCK_RESERVATIONS);

  // viewMode : "list", "detail" ou "edit"
  // C'est comme Panel.Visible en ASP.NET
  const [viewMode, setViewMode] = useState("list");
  const [selectedResa, setSelectedResa] = useState(null);

  // Champs d'édition
  const [editDateDebut, setEditDateDebut] = useState("");
  const [editDateFin, setEditDateFin] = useState("");
  const [editDestination, setEditDestination] = useState("");
  const [editKm, setEditKm] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // ── Voir le détail ──
  const handleViewDetail = (resa) => {
    setSelectedResa(resa);
    setViewMode("detail");
    setMessage("");
  };

  // ── Passer en mode édition ──
  const handleStartEdit = (resa) => {
    setSelectedResa(resa);
    setEditDateDebut(resa.DataInizio);
    setEditDateFin(resa.DataFine);
    setEditDestination(resa.Destinazione);
    setEditKm(resa.KmEstime ? resa.KmEstime.toString() : "");
    setViewMode("edit");
    setMessage("");
  };

  // ── Sauvegarder les modifications ──
  const handleSaveEdit = () => {
    if (!editDateDebut || !editDateFin || !editDestination.trim()) {
      setMessage("REMPLISSEZ TOUS LES CHAMPS");
      setMessageType("error");
      return;
    }

    const d1 = new Date(editDateDebut);
    const d2 = new Date(editDateFin);
    const jours = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)) + 1;

    if (jours <= 0) {
      setMessage("LA DATE DE FIN DOIT ÊTRE APRÈS LA DATE DE DÉBUT");
      setMessageType("error");
      return;
    }

    setReservations(reservations.map((r) => {
      if (r.IdPrenotazione === selectedResa.IdPrenotazione) {
        return {
          ...r,
          DataInizio: editDateDebut,
          DataFine: editDateFin,
          Giorni: jours,
          Destinazione: editDestination.trim(),
          KmEstime: editKm ? parseInt(editKm) : 0,
        };
      }
      return r;
    }));

    setMessage("RÉSERVATION MODIFIÉE AVEC SUCCÈS");
    setMessageType("success");
    setViewMode("list");
    setSelectedResa(null);
  };

  // ── Supprimer ──
  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) {
      setReservations(reservations.filter((r) => r.IdPrenotazione !== id));
      setMessage("RÉSERVATION SUPPRIMÉE");
      setMessageType("success");
      setViewMode("list");
      setSelectedResa(null);
    }
  };

  // ── Retour à la liste ──
  const handleBackToList = () => {
    setViewMode("list");
    setSelectedResa(null);
    setMessage("");
  };

  // Badge de validation RH
  const renderValidation = (val) => {
    if (val === 1) {
      return <span className="validation-badge validated">✅ Validée</span>;
    }
    return <span className="validation-badge pending">⏳ En attente</span>;
  };

  // ── RENDU ──
  return (
    <div className="page-panel" style={{ textAlign: "left" }}>
      <h2 className="marques-title">GESTION DES RÉSERVATIONS</h2>

      {message && (
        <div className={messageType === "error" ? "marques-msg-error" : "marques-msg-success"}>
          {message}
        </div>
      )}

      {/* ═══ MODE LISTE ═══ */}
      {viewMode === "list" && (
        <>
          <p style={{ color: "#666", fontSize: 13, marginBottom: 12 }}>
            {reservations.length} réservation{reservations.length > 1 ? "s" : ""} trouvée{reservations.length > 1 ? "s" : ""}
          </p>
          <div className="marques-table-container" style={{ maxHeight: 500 }}>
            <table className="marques-table">
              <thead>
                <tr>
                  <th style={{ width: 70 }}>ACTIONS</th>
                  <th style={{ width: 50 }}>N°</th>
                  <th>VOITURE</th>
                  <th>PLAQUE</th>
                  <th>DEMANDEUR</th>
                  <th>DU</th>
                  <th>AU</th>
                  <th>JOURS</th>
                  <th>DESTINATION</th>
                  <th style={{ width: 90 }}>VALIDATION</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r.IdPrenotazione}>
                    <td>
                      <button
                        className="btn-select"
                        onClick={() => handleViewDetail(r)}
                        title="Voir détails"
                      >
                        👁
                      </button>
                    </td>
                    <td>{r.ProgressivoPrenotazione}/{r.AnnoPrenotazione}</td>
                    <td>{r.Marca} {r.Modello}</td>
                    <td><strong>{r.Targa}</strong></td>
                    <td>{r.UtentePrenotazione}</td>
                    <td>{r.DataInizio}</td>
                    <td>{r.DataFine}</td>
                    <td>{r.Giorni}</td>
                    <td style={{ textAlign: "left", paddingLeft: 12 }}>{r.Destinazione}</td>
                    <td>{renderValidation(r.ValidationRH)}</td>
                  </tr>
                ))}
                {reservations.length === 0 && (
                  <tr>
                    <td colSpan={10} style={{ color: "#999", padding: 20 }}>
                      Aucune réservation
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ═══ MODE DÉTAIL ═══ */}
      {viewMode === "detail" && selectedResa && (
        <div className="detail-container">
          <button onClick={handleBackToList} className="btn-back">
            ← Retour à la liste
          </button>

          <div className="detail-card">
            <div className="detail-header">
              Réservation N° {selectedResa.ProgressivoPrenotazione}/{selectedResa.AnnoPrenotazione}
              {renderValidation(selectedResa.ValidationRH)}
            </div>
            <div className="detail-body">
              <div className="detail-row">
                <span className="detail-label">Voiture :</span>
                <span>{selectedResa.Marca} {selectedResa.Modello} — <strong>{selectedResa.Targa}</strong></span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Demandeur :</span>
                <span>{selectedResa.UtentePrenotazione}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Période :</span>
                <span>{selectedResa.DataInizio} → {selectedResa.DataFine} ({selectedResa.Giorni} jour{selectedResa.Giorni > 1 ? "s" : ""})</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Destination :</span>
                <span>{selectedResa.Destinazione} {selectedResa.UsineRiva === "O" ? "(Usine Riva)" : ""}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Km estimé :</span>
                <span>{selectedResa.KmEstime || "—"}</span>
              </div>
              {selectedResa.Voyageurs && selectedResa.Voyageurs.length > 0 && (
                <div className="detail-row">
                  <span className="detail-label">Voyageurs :</span>
                  <span>{selectedResa.Voyageurs.join(", ")}</span>
                </div>
              )}
              <div className="detail-row">
                <span className="detail-label">Créée le :</span>
                <span className="detail-date">{selectedResa.InsertData}</span>
              </div>
            </div>

            <div className="detail-actions">
              <button onClick={() => handleStartEdit(selectedResa)} className="btn-insert">
                ✏️ MODIFIER
              </button>
              <button onClick={() => handleDelete(selectedResa.IdPrenotazione)} className="btn-delete">
                🗑 SUPPRIMER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ MODE ÉDITION ═══ */}
      {viewMode === "edit" && selectedResa && (
        <div className="detail-container">
          <button onClick={handleBackToList} className="btn-back">
            ← Retour à la liste
          </button>

          <div className="detail-card">
            <div className="detail-header">
              Modifier Réservation N° {selectedResa.ProgressivoPrenotazione}/{selectedResa.AnnoPrenotazione}
            </div>
            <div className="detail-body">
              <div className="detail-row">
                <span className="detail-label">Voiture :</span>
                <span>{selectedResa.Marca} {selectedResa.Modello} — {selectedResa.Targa}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Date début :</span>
                <input
                  type="date"
                  value={editDateDebut}
                  onChange={(e) => setEditDateDebut(e.target.value)}
                  className="resa-input-date"
                />
              </div>

              <div className="detail-row">
                <span className="detail-label">Date fin :</span>
                <input
                  type="date"
                  value={editDateFin}
                  onChange={(e) => setEditDateFin(e.target.value)}
                  className="resa-input-date"
                />
              </div>

              <div className="detail-row">
                <span className="detail-label">Destination :</span>
                <input
                  type="text"
                  value={editDestination}
                  onChange={(e) => setEditDestination(e.target.value)}
                  className="resa-input"
                  style={{ width: 250 }}
                />
              </div>

              <div className="detail-row">
                <span className="detail-label">Km estimé :</span>
                <input
                  type="number"
                  value={editKm}
                  onChange={(e) => setEditKm(e.target.value)}
                  className="resa-input"
                  style={{ width: 120 }}
                />
              </div>
            </div>

            <div className="detail-actions">
              <button onClick={handleSaveEdit} className="btn-submit-resa" style={{ padding: "12px 40px", fontSize: 14 }}>
                💾 SAUVEGARDER
              </button>
              <button onClick={handleBackToList} className="btn-cancel">
                ANNULER
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const [page, setPage] = useState("login");

  return (
    <AuthProvider>
      <AppContent page={page} setPage={setPage} />
    </AuthProvider>
  );
}
// ─────────────────────────────────────────────
// PAGE MARQUES AUTO
//
// Reproduit par_marche.aspx + par_marche.aspx.cs
//
// Correspondances :
//   dgwMarche (GridView)          → tableau HTML avec marques.map()
//   txtMarca (TextBox)            → newMarque (useState)
//   btnInserimento_Click          → handleInsert()
//   lblMessage.Text               → message (useState)
//   CaricaMarcheAuto()            → loadMarques()
//   GetMarche() + foreach check   → vérification doublon dans handleInsert
//
// CONCEPT REACT IMPORTANT : .map()
//   En C# tu faisais :  foreach (DataRow dr in ds.Tables[0].Rows) { ... }
//   En React on fait :  marques.map((m) => <tr>...</tr>)
//   C'est la même idée : parcourir une liste et créer du HTML pour chaque élément
// ─────────────────────────────────────────────

// Données mock — simule ce que retourne ta stored procedure ff_get_marche
// Plus tard on remplacera par : const response = await fetch("/api/marques");
const MOCK_MARQUES_INITIAL = [
  { IdMarca: 1, Marca: "RENAULT" },
  { IdMarca: 2, Marca: "PEUGEOT" },
  { IdMarca: 3, Marca: "CITROEN" },
  { IdMarca: 4, Marca: "DACIA" },
  { IdMarca: 5, Marca: "FIAT" },
];

function MarquesPage() {
  // ── Les states (variables réactives) ──

  // La liste des marques — comme le DataSet ds dans CaricaMarcheAuto()
  const [marques, setMarques] = useState(MOCK_MARQUES_INITIAL);

  // Le texte saisi dans le champ — comme txtMarca.Text
  const [newMarque, setNewMarque] = useState("");

  // Le message d'info/erreur — comme lblMessage.Text
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "error" ou "success"

  // La marque sélectionnée dans le tableau (pour plus tard : modification/suppression)
  const [selectedId, setSelectedId] = useState(null);

  // ── handleInsert = équivalent de btnInserimento_Click ──
  //
  // En C# tu avais :
  //   foreach (DataRow dr in ds_marche.Tables[0].Rows) {
  //       if (dr["Marca"].ToString().Trim() == txtMarca.Text.Trim()) {
  //           esistente = true; break;
  //       }
  //   }
  //   if (esistente == false) {
  //       htValues["Marca"] = txtMarca.Text.Trim().ToUpper();
  //       ConfigurationHelper.DBHelper.DoJob("insert_marca", htValues);
  //   }
  //
  const handleInsert = () => {
    setMessage("");

    // Vérification champ vide
    if (!newMarque.trim()) {
      setMessage("ENTREZ UNE MARQUE");
      setMessageType("error");
      return;
    }

    // Vérification doublon — comme ton foreach en C#
    const existe = marques.some(
      (m) => m.Marca.toUpperCase() === newMarque.trim().toUpperCase()
    );

    if (existe) {
      setMessage("MARQUE DÉJÀ EXISTANTE");
      setMessageType("error");
      return;
    }

    // Insertion — pour l'instant on ajoute dans le state local
    // Plus tard ce sera : await fetch("/api/marques", { method: "POST", body: ... })
    const newId = marques.length > 0 ? Math.max(...marques.map(m => m.IdMarca)) + 1 : 1;
    const nouvelleMarque = {
      IdMarca: newId,
      Marca: newMarque.trim().toUpperCase(),
    };

    // setMarques([...marques, nouvelleMarque]) signifie :
    // "crée un nouveau tableau avec toutes les anciennes marques + la nouvelle"
    setMarques([...marques, nouvelleMarque]);

    // Nettoyage
    setNewMarque("");
    setMessage("MARQUE AJOUTÉE AVEC SUCCÈS");
    setMessageType("success");
    setSelectedId(null);
  };

  // ── handleDelete — suppression d'une marque ──
  const handleDelete = () => {
    if (selectedId === null) {
      setMessage("SÉLECTIONNEZ UNE MARQUE D'ABORD");
      setMessageType("error");
      return;
    }

    // filter() = garder tous les éléments SAUF celui qu'on supprime
    setMarques(marques.filter((m) => m.IdMarca !== selectedId));
    setSelectedId(null);
    setMessage("MARQUE SUPPRIMÉE");
    setMessageType("success");
  };

  // ── Le rendu (le HTML de la page) ──
  return (
    <div className="page-panel">
      <h2 className="marques-title">MARQUES AUTO</h2>

      {/* Message d'info/erreur — comme lblMessage */}
      {message && (
        <div className={messageType === "error" ? "marques-msg-error" : "marques-msg-success"}>
          {message}
        </div>
      )}

      <div className="marques-layout">

        {/* ── GAUCHE : Tableau (GridView) ── */}
        <div className="marques-table-container">
          <table className="marques-table">
            <thead>
              <tr>
                <th style={{ width: 60 }}>SEL.</th>
                <th style={{ width: 60 }}>ID</th>
                <th>MARQUE</th>
              </tr>
            </thead>
            <tbody>
              {/*
                .map() = équivalent du foreach + DataBind en C#
                Pour chaque marque dans la liste, on crée une ligne <tr>
              */}
              {marques.map((m) => (
                <tr
                  key={m.IdMarca}
                  className={selectedId === m.IdMarca ? "row-selected" : ""}
                >
                  <td>
                    <button
                      className="btn-select"
                      onClick={() => {
                        setSelectedId(m.IdMarca);
                        setNewMarque(m.Marca);
                        setMessage("");
                      }}
                    >
                      SEL.
                    </button>
                  </td>
                  <td>{m.IdMarca}</td>
                  <td style={{ textAlign: "left", paddingLeft: 12 }}>{m.Marca}</td>
                </tr>
              ))}

              {/* Si la liste est vide */}
              {marques.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ color: "#999", padding: 20 }}>
                    Aucune marque
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── DROITE : Formulaire (zone de saisie) ── */}
        <div className="marques-form">
          <div className="marques-form-row">
            <label className="marques-form-label"><strong>MARQUE:</strong></label>
            <input
              type="text"
              value={newMarque}
              onChange={(e) => setNewMarque(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleInsert(); }}
              className="marques-form-input"
              placeholder="Nom de la marque"
            />
          </div>

          <div className="marques-form-buttons">
            <button onClick={handleInsert} className="btn-insert">
              {selectedId ? "MODIFIER MARQUE" : "INSÉRER MARQUE"}
            </button>

            {selectedId && (
              <button onClick={handleDelete} className="btn-delete">
                SUPPRIMER MARQUE
              </button>
            )}

            {selectedId && (
              <button
                onClick={() => {
                  setSelectedId(null);
                  setNewMarque("");
                  setMessage("");
                }}
                className="btn-cancel"
              >
                ANNULER
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
function AppContent({ page, setPage }) {
  const { user } = useAuth();

  // Si pas connecté → redirige vers login
  useEffect(() => {
    if (!user && page !== "login" && page !== "session-expired") {
      setPage("login");
    }
  }, [user, page, setPage]);

  // Si connecté et sur login → redirige vers home
  useEffect(() => {
    if (user && page === "login") {
      setPage("home");
    }
  }, [user, page, setPage]);

  // Page login (pas de Layout autour)
  if (page === "login") {
    return <LoginPage onNavigate={setPage} />;
  }

  // Page session expirée (pas de Layout autour)
  if (page === "session-expired") {
    return <SessionExpiredPage onNavigate={setPage} />;
  }

  // Toutes les autres pages sont dans le Layout (MasterPage)
  const pageContent = {
    home: <HomePage />,
  marques: <MarquesPage />,
    modeles: <ModelesPage />,
    "parc-auto": <ParcAutoPage />,
    "reservation-new": <NewReservationPage />,
    "reservation-edit": <EditReservationPage />,
  };

  return (
    <Layout onNavigate={setPage}>
      {pageContent[page] || <HomePage />}
    </Layout>
  );
}

export default App;