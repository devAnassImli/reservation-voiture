-- ============================================================
-- Script d'initialisation de la base de données
-- SAM_MT_ReservationAuto
-- Pour Docker SQL Server (Linux)
-- Généré automatiquement pour la soutenance CDA
-- ============================================================

USE master;
GO

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'SAM_MT_ReservationAuto')
BEGIN
    CREATE DATABASE SAM_MT_ReservationAuto;
END
GO

USE SAM_MT_ReservationAuto;
GO

CREATE TABLE [dbo].[utAuto](
	[IdAuto] [int] IDENTITY(1,1) NOT NULL,
	[IdModello] [int] NULL,
	[Targa] [nchar](10) NULL,
	[Rottamato] [int] NULL,
	[Priorite] [nchar](1) NULL,
 CONSTRAINT [PK_utAuto] PRIMARY KEY CLUSTERED 
(
	[IdAuto] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[utDettaglioManutenzioni]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[utDettaglioManutenzioni](
	[IdDettaglioManutenzioni] [int] IDENTITY(1,1) NOT NULL,
	[GuidManutenzione] [nchar](8) NULL,
	[DescrizioneManutenzione] [time](7) NULL,
	[InsertData] [datetime] NULL,
 CONSTRAINT [PK_DettaglioManutenzioni] PRIMARY KEY CLUSTERED 
(
	[IdDettaglioManutenzioni] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[utFicheControle]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[utFicheControle](
	[Id_FicheControle] [int] IDENTITY(1,1) NOT NULL,
	[IdPrenotazione] [int] NULL,
	[DateDebutLocation] [datetime] NULL,
	[DateFinLocation] [datetime] NULL,
	[IdAuto] [int] NOT NULL,
	[IdModello] [int] NULL,
	[Targa] [nchar](10) NULL,
	[KmAuDepart] [int] NULL,
	[KmArrive] [int] NULL,
	[CabineVitresEssuieGlaces] [bit] NULL,
	[CabineSiege] [bit] NULL,
	[PneuAvant] [bit] NULL,
	[PnueArriere] [bit] NULL,
	[GeneraleHuileMoteur] [bit] NULL,
	[GeneralCarrosserie] [bit] NULL,
	[GeneralRetroviseursLateraux] [bit] NULL,
	[GeneralVoyantsAllumees] [bit] NULL,
	[AeKlaxon] [bit] NULL,
	[AePhares] [bit] NULL,
	[AePleinsPhares] [bit] NULL,
	[AePharesAntibrouillard] [bit] NULL,
	[EsPropreteInterieur] [nchar](10) NULL,
	[EsPropreteExterieur] [nchar](10) NULL,
	[EsDocumentsVehicule] [nchar](10) NULL,
	[EsCommentaires] [nchar](10) NULL,
	[CabineObservations] [nchar](10) NULL,
	[PneusObservations] [nchar](10) NULL,
	[GeneralesObservations] [nchar](10) NULL,
 CONSTRAINT [PK_utFicheControle] PRIMARY KEY CLUSTERED 
(
	[Id_FicheControle] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[utManutenzioni]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[utManutenzioni](
	[IdManutenzione] [int] IDENTITY(1,1) NOT NULL,
	[GuidManutenzione] [nchar](8) NULL,
	[IdAuto] [int] NULL,
	[DataInizio] [datetime] NULL,
	[DataFine] [datetime] NULL,
	[Giorni] [int] NULL,
	[Km] [int] NULL,
	[Note] [text] NULL,
	[InsertData] [datetime] NULL,
 CONSTRAINT [PK_utManutenzioni] PRIMARY KEY CLUSTERED 
(
	[IdManutenzione] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[utMarche]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[utMarche](
	[IdMarca] [int] IDENTITY(1,1) NOT NULL,
	[Marca] [nvarchar](50) NULL,
 CONSTRAINT [PK_utMarche] PRIMARY KEY CLUSTERED 
(
	[IdMarca] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[utModelli]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[utModelli](
	[IdModello] [int] IDENTITY(1,1) NOT NULL,
	[IdMarca] [int] NULL,
	[Modello] [nvarchar](50) NULL,
	[Cilindrata] [int] NULL,
 CONSTRAINT [PK_utModelli] PRIMARY KEY CLUSTERED 
(
	[IdModello] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[utPrenotazioni]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[utPrenotazioni](
	[IdPrenotazione] [int] IDENTITY(1,1) NOT NULL,
	[IdAuto] [int] NULL,
	[UtentePrenotazione] [nvarchar](50) NULL,
	[Guidatore] [nvarchar](50) NULL,
	[ProgressivoPrenotazione] [int] NULL,
	[AnnoPrenotazione] [int] NULL,
	[DataInizio] [datetime] NULL,
	[DataFine] [datetime] NULL,
	[Giorni] [int] NULL,
	[NomeGuardianoConsegna] [nvarchar](50) NULL,
	[VerificaDocumenti] [bit] NULL,
	[KmIniziali] [int] NULL,
	[DataConsegnaChiavi] [datetime] NULL,
	[NomeGuardianoRitiro] [nvarchar](50) NULL,
	[KmFinali] [int] NULL,
	[DataRitiroChiavi] [datetime] NULL,
	[Note] [text] NULL,
	[InsertData] [datetime] NULL,
	[KmEstime] [int] NULL,
	[Destinazione] [nvarchar](max) NULL,
	[UsineRiva] [char](1) NULL,
	[ValidationRH] [int] NULL,
	[DateValidation] [datetime] NULL,
	[DataVerificaGuardiano] [datetime] NULL,
	[GuidTable] [nchar](10) NULL,
 CONSTRAINT [PK_utPrenotazioni] PRIMARY KEY CLUSTERED 
(
	[IdPrenotazione] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[utVoyagers]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[utVoyagers](
	[GuidTable] [nvarchar](10) NULL,
	[Voyager] [nvarchar](max) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[utAuto] ON 

INSERT [dbo].[utAuto] ([IdAuto], [IdModello], [Targa], [Rottamato], [Priorite]) VALUES (1, 10, N'EB-093-YX ', 0, N'T')
INSERT [dbo].[utAuto] ([IdAuto], [IdModello], [Targa], [Rottamato], [Priorite]) VALUES (2, 6, N'GN-427-LE ', 0, N'N')
INSERT [dbo].[utAuto] ([IdAuto], [IdModello], [Targa], [Rottamato], [Priorite]) VALUES (8, 15, N'AA123XX   ', 0, N'N')
INSERT [dbo].[utAuto] ([IdAuto], [IdModello], [Targa], [Rottamato], [Priorite]) VALUES (9, 10, N'XX-456-EP ', 0, N'T')
INSERT [dbo].[utAuto] ([IdAuto], [IdModello], [Targa], [Rottamato], [Priorite]) VALUES (10, 17, N'YT-567-PP ', 0, N'N')
SET IDENTITY_INSERT [dbo].[utAuto] OFF
GO
SET IDENTITY_INSERT [dbo].[utManutenzioni] ON 

INSERT [dbo].[utManutenzioni] ([IdManutenzione], [GuidManutenzione], [IdAuto], [DataInizio], [DataFine], [Giorni], [Km], [Note], [InsertData]) VALUES (1, NULL, 1, CAST(N'2025-07-24T00:00:00.000' AS DateTime), CAST(N'2025-07-25T00:00:00.000' AS DateTime), NULL, NULL, N'', CAST(N'2025-07-22T14:32:34.960' AS DateTime))
INSERT [dbo].[utManutenzioni] ([IdManutenzione], [GuidManutenzione], [IdAuto], [DataInizio], [DataFine], [Giorni], [Km], [Note], [InsertData]) VALUES (2, NULL, 1, CAST(N'2025-07-28T00:00:00.000' AS DateTime), CAST(N'2025-07-29T00:00:00.000' AS DateTime), NULL, NULL, N'', CAST(N'2025-07-28T10:04:51.233' AS DateTime))
INSERT [dbo].[utManutenzioni] ([IdManutenzione], [GuidManutenzione], [IdAuto], [DataInizio], [DataFine], [Giorni], [Km], [Note], [InsertData]) VALUES (3, NULL, 9, CAST(N'2025-08-07T00:00:00.000' AS DateTime), CAST(N'2025-08-08T00:00:00.000' AS DateTime), NULL, NULL, N'PNEUS A CHANGER !!', CAST(N'2025-08-07T09:15:06.397' AS DateTime))
SET IDENTITY_INSERT [dbo].[utManutenzioni] OFF
GO
SET IDENTITY_INSERT [dbo].[utMarche] ON 

INSERT [dbo].[utMarche] ([IdMarca], [Marca]) VALUES (15, N'BMW')
INSERT [dbo].[utMarche] ([IdMarca], [Marca]) VALUES (2, N'CITROEN')
INSERT [dbo].[utMarche] ([IdMarca], [Marca]) VALUES (20, N'FERRARI')
INSERT [dbo].[utMarche] ([IdMarca], [Marca]) VALUES (21, N'FIAT')
INSERT [dbo].[utMarche] ([IdMarca], [Marca]) VALUES (17, N'LANCIA')
INSERT [dbo].[utMarche] ([IdMarca], [Marca]) VALUES (12, N'LOCATION')
INSERT [dbo].[utMarche] ([IdMarca], [Marca]) VALUES (5, N'RENAULT')
INSERT [dbo].[utMarche] ([IdMarca], [Marca]) VALUES (18, N'TEST')
INSERT [dbo].[utMarche] ([IdMarca], [Marca]) VALUES (13, N'UTILITAIRE')
INSERT [dbo].[utMarche] ([IdMarca], [Marca]) VALUES (19, N'VOLKSWAGEN')
SET IDENTITY_INSERT [dbo].[utMarche] OFF
GO
SET IDENTITY_INSERT [dbo].[utModelli] ON 

INSERT [dbo].[utModelli] ([IdModello], [IdMarca], [Modello], [Cilindrata]) VALUES (3, 15, N'C3', 1000)
INSERT [dbo].[utModelli] ([IdModello], [IdMarca], [Modello], [Cilindrata]) VALUES (6, 2, N'C4', 1500)
INSERT [dbo].[utModelli] ([IdModello], [IdMarca], [Modello], [Cilindrata]) VALUES (7, 12, N'VEHICULE 1', 500)
INSERT [dbo].[utModelli] ([IdModello], [IdMarca], [Modello], [Cilindrata]) VALUES (8, 12, N'VEHICULE 2', 800)
INSERT [dbo].[utModelli] ([IdModello], [IdMarca], [Modello], [Cilindrata]) VALUES (9, 12, N'VEHICULE 3', 850)
INSERT [dbo].[utModelli] ([IdModello], [IdMarca], [Modello], [Cilindrata]) VALUES (10, 13, N'JUMPY', 1250)
INSERT [dbo].[utModelli] ([IdModello], [IdMarca], [Modello], [Cilindrata]) VALUES (15, 15, N'C5', 1000)
INSERT [dbo].[utModelli] ([IdModello], [IdMarca], [Modello], [Cilindrata]) VALUES (16, 2, N'C3 BIS', 1000)
INSERT [dbo].[utModelli] ([IdModello], [IdMarca], [Modello], [Cilindrata]) VALUES (17, 19, N'TROC', 2000)
SET IDENTITY_INSERT [dbo].[utModelli] OFF
GO
SET IDENTITY_INSERT [dbo].[utPrenotazioni] ON 

INSERT [dbo].[utPrenotazioni] ([IdPrenotazione], [IdAuto], [UtentePrenotazione], [Guidatore], [ProgressivoPrenotazione], [AnnoPrenotazione], [DataInizio], [DataFine], [Giorni], [NomeGuardianoConsegna], [VerificaDocumenti], [KmIniziali], [DataConsegnaChiavi], [NomeGuardianoRitiro], [KmFinali], [DataRitiroChiavi], [Note], [InsertData], [KmEstime], [Destinazione], [UsineRiva], [ValidationRH], [DateValidation], [DataVerificaGuardiano], [GuidTable]) VALUES (1, 8, N'COPPOLA Manlio', NULL, 1, 2025, CAST(N'2025-07-23T08:00:00.000' AS DateTime), CAST(N'2025-07-25T17:00:00.000' AS DateTime), 3, N'CHIRAC JACK', 0, NULL, CAST(N'2025-08-07T09:15:40.160' AS DateTime), NULL, NULL, NULL, N'PERMIS NON VALABLE', CAST(N'2025-07-22T10:11:04.297' AS DateTime), 630, N'SAM Neuves Maisons', N'R', NULL, NULL, NULL, N'b202b2db16')
INSERT [dbo].[utPrenotazioni] ([IdPrenotazione], [IdAuto], [UtentePrenotazione], [Guidatore], [ProgressivoPrenotazione], [AnnoPrenotazione], [DataInizio], [DataFine], [Giorni], [NomeGuardianoConsegna], [VerificaDocumenti], [KmIniziali], [DataConsegnaChiavi], [NomeGuardianoRitiro], [KmFinali], [DataRitiroChiavi], [Note], [InsertData], [KmEstime], [Destinazione], [UsineRiva], [ValidationRH], [DateValidation], [DataVerificaGuardiano], [GuidTable]) VALUES (2, 1, N'COPPOLA Manlio', NULL, 2, 2025, CAST(N'2025-07-23T08:00:00.000' AS DateTime), CAST(N'2025-07-23T20:00:00.000' AS DateTime), 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, CAST(N'2025-07-22T14:54:30.960' AS DateTime), 630, N'SAM Neuves Maisons', N'R', NULL, NULL, NULL, N'1ee8b24510')
INSERT [dbo].[utPrenotazioni] ([IdPrenotazione], [IdAuto], [UtentePrenotazione], [Guidatore], [ProgressivoPrenotazione], [AnnoPrenotazione], [DataInizio], [DataFine], [Giorni], [NomeGuardianoConsegna], [VerificaDocumenti], [KmIniziali], [DataConsegnaChiavi], [NomeGuardianoRitiro], [KmFinali], [DataRitiroChiavi], [Note], [InsertData], [KmEstime], [Destinazione], [UsineRiva], [ValidationRH], [DateValidation], [DataVerificaGuardiano], [GuidTable]) VALUES (3, 2, N'COPPOLA Manlio', NULL, 3, 2025, CAST(N'2025-07-23T21:00:00.000' AS DateTime), CAST(N'2025-07-24T10:00:00.000' AS DateTime), 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, CAST(N'2025-07-22T14:59:34.783' AS DateTime), 986, N'ACOR St. Just', N'R', NULL, NULL, NULL, N'583099e47e')
INSERT [dbo].[utPrenotazioni] ([IdPrenotazione], [IdAuto], [UtentePrenotazione], [Guidatore], [ProgressivoPrenotazione], [AnnoPrenotazione], [DataInizio], [DataFine], [Giorni], [NomeGuardianoConsegna], [VerificaDocumenti], [KmIniziali], [DataConsegnaChiavi], [NomeGuardianoRitiro], [KmFinali], [DataRitiroChiavi], [Note], [InsertData], [KmEstime], [Destinazione], [UsineRiva], [ValidationRH], [DateValidation], [DataVerificaGuardiano], [GuidTable]) VALUES (4, 2, N'IMLI Anass', NULL, 4, 2025, CAST(N'2025-07-29T08:00:00.000' AS DateTime), CAST(N'2025-07-29T15:00:00.000' AS DateTime), 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, CAST(N'2025-07-28T10:05:49.470' AS DateTime), 630, N'SAM Neuves Maisons', N'R', NULL, NULL, NULL, N'3e57789d78')
INSERT [dbo].[utPrenotazioni] ([IdPrenotazione], [IdAuto], [UtentePrenotazione], [Guidatore], [ProgressivoPrenotazione], [AnnoPrenotazione], [DataInizio], [DataFine], [Giorni], [NomeGuardianoConsegna], [VerificaDocumenti], [KmIniziali], [DataConsegnaChiavi], [NomeGuardianoRitiro], [KmFinali], [DataRitiroChiavi], [Note], [InsertData], [KmEstime], [Destinazione], [UsineRiva], [ValidationRH], [DateValidation], [DataVerificaGuardiano], [GuidTable]) VALUES (5, 1, N'IMLI Anass', NULL, 5, 2025, CAST(N'2025-07-28T09:00:00.000' AS DateTime), CAST(N'2025-07-31T13:00:00.000' AS DateTime), 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, CAST(N'2025-07-28T14:59:49.770' AS DateTime), NULL, NULL, N'F', NULL, NULL, NULL, N'8cc3a2e8ef')
INSERT [dbo].[utPrenotazioni] ([IdPrenotazione], [IdAuto], [UtentePrenotazione], [Guidatore], [ProgressivoPrenotazione], [AnnoPrenotazione], [DataInizio], [DataFine], [Giorni], [NomeGuardianoConsegna], [VerificaDocumenti], [KmIniziali], [DataConsegnaChiavi], [NomeGuardianoRitiro], [KmFinali], [DataRitiroChiavi], [Note], [InsertData], [KmEstime], [Destinazione], [UsineRiva], [ValidationRH], [DateValidation], [DataVerificaGuardiano], [GuidTable]) VALUES (7, 10, N'IMLI Anass', NULL, 6, 2025, CAST(N'2025-07-28T10:00:00.000' AS DateTime), CAST(N'2025-07-29T17:00:00.000' AS DateTime), 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, CAST(N'2025-07-28T15:51:11.653' AS DateTime), 630, N'SAM Neuves Maisons', N'R', NULL, NULL, NULL, N'53ab3395ea')
INSERT [dbo].[utPrenotazioni] ([IdPrenotazione], [IdAuto], [UtentePrenotazione], [Guidatore], [ProgressivoPrenotazione], [AnnoPrenotazione], [DataInizio], [DataFine], [Giorni], [NomeGuardianoConsegna], [VerificaDocumenti], [KmIniziali], [DataConsegnaChiavi], [NomeGuardianoRitiro], [KmFinali], [DataRitiroChiavi], [Note], [InsertData], [KmEstime], [Destinazione], [UsineRiva], [ValidationRH], [DateValidation], [DataVerificaGuardiano], [GuidTable]) VALUES (8, 10, N'IMLI Anass', NULL, 7, 2025, CAST(N'2025-08-04T08:00:00.000' AS DateTime), CAST(N'2025-08-07T17:00:00.000' AS DateTime), 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, CAST(N'2025-07-28T15:52:12.810' AS DateTime), 630, N'SAM Neuves Maisons', N'R', NULL, NULL, NULL, N'44250fcb24')
INSERT [dbo].[utPrenotazioni] ([IdPrenotazione], [IdAuto], [UtentePrenotazione], [Guidatore], [ProgressivoPrenotazione], [AnnoPrenotazione], [DataInizio], [DataFine], [Giorni], [NomeGuardianoConsegna], [VerificaDocumenti], [KmIniziali], [DataConsegnaChiavi], [NomeGuardianoRitiro], [KmFinali], [DataRitiroChiavi], [Note], [InsertData], [KmEstime], [Destinazione], [UsineRiva], [ValidationRH], [DateValidation], [DataVerificaGuardiano], [GuidTable]) VALUES (9, 8, N'IMLI Anass', NULL, 8, 2025, CAST(N'2025-07-30T00:00:00.000' AS DateTime), CAST(N'2025-07-31T18:00:00.000' AS DateTime), 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, CAST(N'2025-07-29T14:03:10.573' AS DateTime), 320, N'Iton Seine', N'R', NULL, NULL, NULL, N'f5040375cc')
INSERT [dbo].[utPrenotazioni] ([IdPrenotazione], [IdAuto], [UtentePrenotazione], [Guidatore], [ProgressivoPrenotazione], [AnnoPrenotazione], [DataInizio], [DataFine], [Giorni], [NomeGuardianoConsegna], [VerificaDocumenti], [KmIniziali], [DataConsegnaChiavi], [NomeGuardianoRitiro], [KmFinali], [DataRitiroChiavi], [Note], [InsertData], [KmEstime], [Destinazione], [UsineRiva], [ValidationRH], [DateValidation], [DataVerificaGuardiano], [GuidTable]) VALUES (11, 9, N'IMLI Anass', NULL, 9, 2025, CAST(N'2025-07-31T13:00:00.000' AS DateTime), CAST(N'2025-08-01T19:00:00.000' AS DateTime), 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, CAST(N'2025-07-30T08:56:24.283' AS DateTime), NULL, NULL, N'T', NULL, NULL, NULL, N'77ffbeef48')
INSERT [dbo].[utPrenotazioni] ([IdPrenotazione], [IdAuto], [UtentePrenotazione], [Guidatore], [ProgressivoPrenotazione], [AnnoPrenotazione], [DataInizio], [DataFine], [Giorni], [NomeGuardianoConsegna], [VerificaDocumenti], [KmIniziali], [DataConsegnaChiavi], [NomeGuardianoRitiro], [KmFinali], [DataRitiroChiavi], [Note], [InsertData], [KmEstime], [Destinazione], [UsineRiva], [ValidationRH], [DateValidation], [DataVerificaGuardiano], [GuidTable]) VALUES (12, 2, N'IMLI Anass', NULL, 10, 2025, CAST(N'2025-08-14T19:15:00.000' AS DateTime), CAST(N'2025-08-16T20:00:00.000' AS DateTime), 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, CAST(N'2025-08-06T15:12:42.147' AS DateTime), NULL, N'ACOR Vauvert', N'R', NULL, NULL, NULL, N'ca87f72d48')
INSERT [dbo].[utPrenotazioni] ([IdPrenotazione], [IdAuto], [UtentePrenotazione], [Guidatore], [ProgressivoPrenotazione], [AnnoPrenotazione], [DataInizio], [DataFine], [Giorni], [NomeGuardianoConsegna], [VerificaDocumenti], [KmIniziali], [DataConsegnaChiavi], [NomeGuardianoRitiro], [KmFinali], [DataRitiroChiavi], [Note], [InsertData], [KmEstime], [Destinazione], [UsineRiva], [ValidationRH], [DateValidation], [DataVerificaGuardiano], [GuidTable]) VALUES (13, 8, N'IMLI Anass', NULL, 11, 2025, CAST(N'2025-08-08T09:15:00.000' AS DateTime), CAST(N'2025-08-11T09:00:00.000' AS DateTime), 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, CAST(N'2025-08-07T09:14:13.057' AS DateTime), NULL, N'CFA INSTA', N'A', NULL, NULL, NULL, N'd623d724be')
INSERT [dbo].[utPrenotazioni] ([IdPrenotazione], [IdAuto], [UtentePrenotazione], [Guidatore], [ProgressivoPrenotazione], [AnnoPrenotazione], [DataInizio], [DataFine], [Giorni], [NomeGuardianoConsegna], [VerificaDocumenti], [KmIniziali], [DataConsegnaChiavi], [NomeGuardianoRitiro], [KmFinali], [DataRitiroChiavi], [Note], [InsertData], [KmEstime], [Destinazione], [UsineRiva], [ValidationRH], [DateValidation], [DataVerificaGuardiano], [GuidTable]) VALUES (14, 8, N'IMLI Anass', NULL, 1, 2026, CAST(N'2026-05-01T00:00:00.000' AS DateTime), CAST(N'2026-05-29T00:00:00.000' AS DateTime), 29, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, CAST(N'2026-04-13T13:30:04.810' AS DateTime), 0, N'sam h', N'O', NULL, NULL, NULL, N'GT79804891')
SET IDENTITY_INSERT [dbo].[utPrenotazioni] OFF
GO
INSERT [dbo].[utVoyagers] ([GuidTable], [Voyager]) VALUES (N'a40e53e3c0', N'COPPOLA MANLIO')
INSERT [dbo].[utVoyagers] ([GuidTable], [Voyager]) VALUES (N'c5528fdd09', N'COPPOLA MANLIO')
INSERT [dbo].[utVoyagers] ([GuidTable], [Voyager]) VALUES (N'425ff6ae2e', N'COPPOLA MANLIO')
INSERT [dbo].[utVoyagers] ([GuidTable], [Voyager]) VALUES (N'e2939c2a0b', N'COPPOLA MANLIO')
INSERT [dbo].[utVoyagers] ([GuidTable], [Voyager]) VALUES (N'e2939c2a0b', N'ANASS IMLI')
INSERT [dbo].[utVoyagers] ([GuidTable], [Voyager]) VALUES (N'1ab3d24702', N'COPPOLA MANLIO')
INSERT [dbo].[utVoyagers] ([GuidTable], [Voyager]) VALUES (N'1ab3d24702', N'ANASS IMLI')
INSERT [dbo].[utVoyagers] ([GuidTable], [Voyager]) VALUES (N'1ab3d24702', N'MACRON EMMANUELLE')
INSERT [dbo].[utVoyagers] ([GuidTable], [Voyager]) VALUES (N'051b8d8b8b', N'COPPOLA MANLIO')
INSERT [dbo].[utVoyagers] ([GuidTable], [Voyager]) VALUES (N'051b8d8b8b', N'ANASS IMLI')
INSERT [dbo].[utVoyagers] ([GuidTable], [Voyager]) VALUES (N'b202b2db16', N'COPPOLA MANLIO')
INSERT [dbo].[utVoyagers] ([GuidTable], [Voyager]) VALUES (N'663c4849a3', N'IMLI ANASS')
INSERT [dbo].[utVoyagers] ([GuidTable], [Voyager]) VALUES (N'f5040375cc', N'IMLI ANASS')
INSERT [dbo].[utVoyagers] ([GuidTable], [Voyager]) VALUES (N'ca87f72d48', N'IMLI ANASS')
INSERT [dbo].[utVoyagers] ([GuidTable], [Voyager]) VALUES (N'ca87f72d48', N'JEAN')
INSERT [dbo].[utVoyagers] ([GuidTable], [Voyager]) VALUES (N'd623d724be', N'IMLI ANASS')
INSERT [dbo].[utVoyagers] ([GuidTable], [Voyager]) VALUES (N'GT79804891', N'amed')
INSERT [dbo].[utVoyagers] ([GuidTable], [Voyager]) VALUES (N'0bcb587f5c', N'COPPOLA MANLIO')
INSERT [dbo].[utVoyagers] ([GuidTable], [Voyager]) VALUES (N'0bcb587f5c', N'ANASS IMLI')
INSERT [dbo].[utVoyagers] ([GuidTable], [Voyager]) VALUES (N'737dd66b99', N'COPPOLA MANLIO')
INSERT [dbo].[utVoyagers] ([GuidTable], [Voyager]) VALUES (N'737dd66b99', N'ANASS IMLI')
INSERT [dbo].[utVoyagers] ([GuidTable], [Voyager]) VALUES (N'1ee8b24510', N'COPPOLA MANLIO')
INSERT [dbo].[utVoyagers] ([GuidTable], [Voyager]) VALUES (N'583099e47e', N'COPPOLA MANLIO')
INSERT [dbo].[utVoyagers] ([GuidTable], [Voyager]) VALUES (N'8cc3a2e8ef', N'IMLI ANASS')
INSERT [dbo].[utVoyagers] ([GuidTable], [Voyager]) VALUES (N'53ab3395ea', N'IMLI ANASS')
INSERT [dbo].[utVoyagers] ([GuidTable], [Voyager]) VALUES (N'44250fcb24', N'IMLI ANASS')
INSERT [dbo].[utVoyagers] ([GuidTable], [Voyager]) VALUES (N'77ffbeef48', N'IMLI ANASS')
INSERT [dbo].[utVoyagers] ([GuidTable], [Voyager]) VALUES (N'3e57789d78', N'IMLI ANASS')
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_utMarche]    Script Date: 13/04/2026 13:57:34 ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_utMarche] ON [dbo].[utMarche]
(
	[Marca] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[utAuto] ADD  CONSTRAINT [DF_utAuto_Priorite]  DEFAULT (N'N') FOR [Priorite]
GO
ALTER TABLE [dbo].[utAuto]  WITH CHECK ADD  CONSTRAINT [FK_utAuto_utModelli] FOREIGN KEY([IdModello])
REFERENCES [dbo].[utModelli] ([IdModello])
GO
ALTER TABLE [dbo].[utAuto] CHECK CONSTRAINT [FK_utAuto_utModelli]
GO
ALTER TABLE [dbo].[utFicheControle]  WITH CHECK ADD  CONSTRAINT [FK_utFicheControle_utPrenotazioni] FOREIGN KEY([IdPrenotazione])
REFERENCES [dbo].[utPrenotazioni] ([IdPrenotazione])
GO
ALTER TABLE [dbo].[utFicheControle] CHECK CONSTRAINT [FK_utFicheControle_utPrenotazioni]
GO
ALTER TABLE [dbo].[utManutenzioni]  WITH CHECK ADD  CONSTRAINT [FK_utManutenzioni_utAuto] FOREIGN KEY([IdAuto])
REFERENCES [dbo].[utAuto] ([IdAuto])
GO
ALTER TABLE [dbo].[utManutenzioni] CHECK CONSTRAINT [FK_utManutenzioni_utAuto]
GO
ALTER TABLE [dbo].[utModelli]  WITH CHECK ADD  CONSTRAINT [FK_utModelli_utMarche] FOREIGN KEY([IdMarca])
REFERENCES [dbo].[utMarche] ([IdMarca])
GO
ALTER TABLE [dbo].[utModelli] CHECK CONSTRAINT [FK_utModelli_utMarche]
GO
ALTER TABLE [dbo].[utPrenotazioni]  WITH CHECK ADD  CONSTRAINT [FK_utPrenotazioni_utAuto] FOREIGN KEY([IdAuto])
REFERENCES [dbo].[utAuto] ([IdAuto])
GO
ALTER TABLE [dbo].[utPrenotazioni] CHECK CONSTRAINT [FK_utPrenotazioni_utAuto]
GO
/****** Object:  StoredProcedure [dbo].[ai_delete_auto]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:        Anass Imli
-- Create date:   22/05/2025
-- Description:   Supprime une voiture dans la table utAuto
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[ai_delete_auto]
    @IdAuto INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Vérifier que l'IdAuto est valide
    IF @IdAuto IS NULL OR @IdAuto <= 0
    BEGIN
        RAISERROR('IdAuto invalide.', 16, 1);
        RETURN;
    END

    -- Supprimer la voiture correspondant à l'IdAuto
    DELETE FROM [dbo].[utAuto]
    WHERE IdAuto = @IdAuto;

    -- Si aucune ligne n'a été supprimée, on informe l'utilisateur
    IF @@ROWCOUNT = 0
    BEGIN
        RAISERROR('Aucune voiture trouvée avec cet IdAuto.', 16, 1);
    END
END
GO
/****** Object:  StoredProcedure [dbo].[ai_delete_marque]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Anass Imli
-- Create date: 15/05/2025
-- Description:	Procédure d'annulation d'une marque
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[ai_delete_marque]
	-- Add the parameters for the stored procedure here

				@IdMarca int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	DELETE FROM [dbo].[utMarche]
      WHERE IdMarca = @IdMarca


END
GO
/****** Object:  StoredProcedure [dbo].[ai_get_control_disponibilite]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Anass Imli
-- Create date: 27/05/2025
-- Description:	Cette procédure vous permet de vérifier s'il y a des voitures disponibles pour la période sélectionnée
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[ai_get_control_disponibilite]
	-- Add the parameters for the stored procedure here

		@DataDeparture datetime,
		@DataRetourn datetime,
		@Priorite nchar (1)

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
if (@Priorite = 'R' or @Priorite = 'A') -- priorite usine RIVA et autres destinations
begin
	SELECT [IdPrenotazione]
      ,[dbo].[utPrenotazioni].[IdAuto]
      ,[DataInizio]
      ,[DataFine]
	  ,[Priorite]
  FROM [dbo].[utPrenotazioni]
  full outer join [dbo].[utAuto] on [dbo].[utAuto].IdAuto = [dbo].[utPrenotazioni].IdAuto
  where (([DataInizio] < @DataDeparture and [DataFine] > @DataDeparture)
  or ([DataInizio] < @DataRetourn and [DataFine] > @DataRetourn))
end

else
if (@Priorite = 'F')
begin
	SELECT [IdPrenotazione]
      ,[dbo].[utPrenotazioni].[IdAuto]
      ,[DataInizio]
      ,[DataFine]
	  ,[Priorite]
  FROM [dbo].[utPrenotazioni]
  full outer join [dbo].[utAuto] on [dbo].[utAuto].IdAuto = [dbo].[utPrenotazioni].IdAuto
  where (([DataInizio] < @DataDeparture and [DataFine] > @DataDeparture)
  or ([DataInizio] < @DataRetourn and [DataFine] > @DataRetourn))
  and [Priorite] = 'F'
end

else
if (@Priorite = 'T')
begin
	SELECT [IdPrenotazione]
      ,[dbo].[utPrenotazioni].[IdAuto]
      ,[DataInizio]
      ,[DataFine]
	  ,[Priorite]
  FROM [dbo].[utPrenotazioni]
  full outer join [dbo].[utAuto] on [dbo].[utAuto].IdAuto = [dbo].[utPrenotazioni].IdAuto
  where (([DataInizio] < @DataDeparture and [DataFine] > @DataDeparture)
  or ([DataInizio] < @DataRetourn and [DataFine] > @DataRetourn))
  and [Priorite] = 'T'
end


END
GO
/****** Object:  StoredProcedure [dbo].[ai_get_control_disponibilite_pour_maintenance]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Anass Imli
-- Create date: 22/07/2025
-- Description:	Vérifiez la disponibilité des réservations pour chaque voiture individuelle pour voir si l'entretien est disponible pendant cette période.
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[ai_get_control_disponibilite_pour_maintenance]
	-- Add the parameters for the stored procedure here


	@DataDeparture datetime,
	@DataRetourn datetime,
	@IdAuto int

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here

SELECT [IdPrenotazione]
      ,[dbo].[utPrenotazioni].[IdAuto]
      ,[DataInizio]
      ,[DataFine]
	  ,[Priorite]
  FROM [dbo].[utPrenotazioni]
  full outer join [dbo].[utAuto] on [dbo].[utAuto].IdAuto = [dbo].[utPrenotazioni].IdAuto
  where (([DataInizio] <= @DataDeparture and [DataFine] >= @DataDeparture)
  or ([DataInizio] <= @DataRetourn and [DataFine] >= @DataRetourn))
  and [dbo].[utPrenotazioni].[IdAuto] = @IdAuto



END
GO
/****** Object:  StoredProcedure [dbo].[ai_get_control_disponibilite_pour_reservation]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Anass Imli
-- Create date: 22/07/2025
-- Description:	Vérifiez la disponibilité des maintenance pour chaque voiture individuelle pour voir si la reservation est disponible pendant cette période.
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[ai_get_control_disponibilite_pour_reservation]
	-- Add the parameters for the stored procedure here


	@DataDeparture datetime,
	@DataRetourn datetime,
	@IdAuto int

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here

SELECT [IdManutenzione]
      ,[GuidManutenzione]
      ,[IdAuto]
      ,[DataInizio]
      ,[DataFine]
  FROM [SAM_MT_ReservationAuto].[dbo].[utManutenzioni]
  where ([DataInizio] <= @DataRetourn and [DataFine] >= @DataRetourn)
  and IdAuto = @IdAuto

  
END
GO
/****** Object:  StoredProcedure [dbo].[ai_get_maintenance]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[ai_get_maintenance] 
	-- Add the parameters for the stored procedure here
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
SELECT [IdManutenzione]
      ,[GuidManutenzione]
      ,[IdAuto]
      ,[DataInizio]
      ,[DataFine]
      ,[Giorni]
      ,[Km]
      ,[Note]
      ,[InsertData]
  FROM [dbo].[utManutenzioni]
END
GO
/****** Object:  StoredProcedure [dbo].[ai_get_marque_pour_id]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Anass Imli
-- Create date: 14/05/2025
-- Description:	procédure de sélection d'un enregistrement dans la table des utMarche par IdMarca
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[ai_get_marque_pour_id]
	-- Add the parameters for the stored procedure here

				@IdMarca int

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here

SELECT [IdMarca]
      ,[Marca]
  FROM [SAM_MT_ReservationAuto].[dbo].[utMarche]
  where IdMarca = @IdMarca



END
GO
/****** Object:  StoredProcedure [dbo].[ai_get_modelle_pour_id]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[ai_get_modelle_pour_id]
	-- Add the parameters for the stored procedure here

				@IdModello int

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here

SELECT [IdModello]
      ,[IdMarca]
      ,[Modello]
      ,[Cilindrata]
  FROM [dbo].[utModelli]
  where IdModello = @IdModello


END
GO
/****** Object:  StoredProcedure [dbo].[ai_get_progressivo_prenotazione]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Anass Imli
-- Create date: 30/05/2025
-- Description:	Cette procédure permet de prendre la dernière réservation (réservation progressive) de l'année en cours
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[ai_get_progressivo_prenotazione]
	-- Add the parameters for the stored procedure here


AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here

SELECT top (1) [ProgressivoPrenotazione]
			  ,[AnnoPrenotazione]
  FROM [SAM_MT_ReservationAuto].[dbo].[utPrenotazioni]
  where AnnoPrenotazione = year(getdate())
  order by ProgressivoPrenotazione desc

END
GO
/****** Object:  StoredProcedure [dbo].[ai_get_reservation_complete]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Anass Imli
-- Create date: 30/05/2025
-- Description:	Tous le reservations
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[ai_get_reservation_complete]
	-- Add the parameters for the stored procedure here

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here

SELECT [IdPrenotazione]
      ,[IdAuto]
      ,[UtentePrenotazione]
      ,[Guidatore]
      ,[ProgressivoPrenotazione]
      ,[AnnoPrenotazione]
      ,[DataInizio]
      ,[DataFine]
      ,[Giorni]
      ,[NomeGuardianoConsegna]
      ,[VerificaDocumenti]
      ,[KmIniziali]
      ,[DataConsegnaChiavi]
      ,[NomeGuardianoRitiro]
      ,[KmFinali]
      ,[DataRitiroChiavi]
      ,[Note]
      ,[InsertData]
      ,[KmEstime]
      ,[Destinazione]
      ,[UsineRiva]
	  ,[ValidationRH]
	  ,[DateValidation]
	  ,[GuidTable]
  FROM [SAM_MT_ReservationAuto].[dbo].[utPrenotazioni]

END
GO
/****** Object:  StoredProcedure [dbo].[ai_get_reservation_complete_pour_idPrenotazione]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Anass Imli
-- Create date: 30/05/2025
-- Description:	Tous le reservations
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[ai_get_reservation_complete_pour_idPrenotazione]
	-- Add the parameters for the stored procedure here

				@IdPrenotazione int

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here

SELECT			utPrenotazioni.IdPrenotazione, 
				utPrenotazioni.IdAuto, 
				utPrenotazioni.UtentePrenotazione, 
				utPrenotazioni.Guidatore, 
				utPrenotazioni.ProgressivoPrenotazione, 
				utPrenotazioni.AnnoPrenotazione, 
				utPrenotazioni.DataInizio, 
                utPrenotazioni.DataFine, 
				utPrenotazioni.Giorni, 
				utPrenotazioni.NomeGuardianoConsegna, 
				utPrenotazioni.VerificaDocumenti, 
				utPrenotazioni.KmIniziali, 
				utPrenotazioni.DataConsegnaChiavi, 
				utPrenotazioni.NomeGuardianoRitiro, 
                utPrenotazioni.KmFinali,
				utPrenotazioni.DataRitiroChiavi, 
				utPrenotazioni.Note, 
				utPrenotazioni.InsertData, 
				utPrenotazioni.KmEstime, 
				utPrenotazioni.Destinazione, 
				utPrenotazioni.UsineRiva, 
				utPrenotazioni.ValidationRH, 
                utPrenotazioni.DateValidation, 
				utMarche.Marca, 
				utModelli.Modello, 
				utAuto.Targa
FROM            utPrenotazioni 
full outer JOIN     utAuto ON utPrenotazioni.IdAuto = utAuto.IdAuto 
full outer JOIN     utModelli ON utAuto.IdModello = utModelli.IdModello 
full outer JOIN    utMarche ON utModelli.IdMarca = utMarche.IdMarca
WHERE         (utPrenotazioni.IdPrenotazione = @IdPrenotazione)

END
GO
/****** Object:  StoredProcedure [dbo].[ai_get_voiture_flotte_complete]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[ai_get_voiture_flotte_complete]
	-- Add the parameters for the stored procedure here

				@Priorite nchar (1)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here

if (@Priorite = 'R' or @Priorite = 'A') -- priorite usine RIVA et autres destinations
begin
		SELECT      utAuto.IdAuto, 
					utAuto.Targa, 
					utMarche.Marca, 
					utModelli.Modello
		FROM        utAuto 
		INNER JOIN  utModelli ON utAuto.IdModello = utModelli.IdModello 
		INNER JOIN utMarche ON utModelli.IdMarca = utMarche.IdMarca
		order by    utMarche.Marca
end

else
if (@Priorite = 'F') -- formation
begin
		SELECT      utAuto.IdAuto, 
					utAuto.Targa, 
					utMarche.Marca, 
					utModelli.Modello
		FROM        utAuto 
		INNER JOIN  utModelli ON utAuto.IdModello = utModelli.IdModello 
		INNER JOIN utMarche ON utModelli.IdMarca = utMarche.IdMarca
		where		utAuto.Priorite = 'F'
		order by    utMarche.Marca
end

else
if (@Priorite = 'T') -- transport
begin
		SELECT      utAuto.IdAuto, 
					utAuto.Targa, 
					utMarche.Marca, 
					utModelli.Modello
		FROM        utAuto 
		INNER JOIN  utModelli ON utAuto.IdModello = utModelli.IdModello 
		INNER JOIN utMarche ON utModelli.IdMarca = utMarche.IdMarca
		where		utAuto.Priorite = 'T'
		order by    utMarche.Marca
end
else 
if (@Priorite = 'W') -- tous le voiture
begin
		SELECT      utAuto.IdAuto, 
					utAuto.Targa, 
					utMarche.Marca, 
					utModelli.Modello
		FROM        utAuto 
		INNER JOIN  utModelli ON utAuto.IdModello = utModelli.IdModello 
		INNER JOIN utMarche ON utModelli.IdMarca = utMarche.IdMarca
		
		order by    utMarche.Marca
end

END
GO
/****** Object:  StoredProcedure [dbo].[ai_get_voyagers_pour_guid_table]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[ai_get_voyagers_pour_guid_table]
	-- Add the parameters for the stored procedure here

			@GuidTable nvarchar (10)

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here

SELECT [GuidTable]
      ,[Voyager]
  FROM [dbo].[utVoyagers]
  where [GuidTable] = @GuidTable

END
GO
/****** Object:  StoredProcedure [dbo].[ai_insert_maintenance]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Anass IMLI
-- Create date: 16/07/2025
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[ai_insert_maintenance]
	-- Add the parameters for the stored procedure here

	@IdAuto int,
	@DataInizio DateTime ,
	@DataFine DateTime , 
	@Note Text 

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	INSERT INTO [dbo].[utManutenzioni]
           ([IdAuto]
           ,[DataInizio]
           ,[DataFine]
           ,[Note]
           ,[InsertData])
     VALUES
           (@IdAuto 
           ,@DataInizio
           ,@DataFine
           ,@Note
           ,GETDATE())
		   
END
GO
/****** Object:  StoredProcedure [dbo].[ai_insert_reservation]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Anass Imli
-- Create date: 30/05/2025
-- Description:	Procédure pour la première entrée en réservation
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[ai_insert_reservation]
	-- Add the parameters for the stored procedure here

	@UtentePrenotazione nvarchar(50),
	@ProgressivoPrenotazione int,
	@AnnoPrenotazione int,
	@DataInizio datetime,
    @DataFine datetime,
	@Giorni int,
	@KmEstime int,
	@Destinazione nvarchar(max),
	@UsineRiva char(1),
	@GuidTable nvarchar(10),
	@IdAuto int


AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here

INSERT INTO [dbo].[utPrenotazioni]
           ([UtentePrenotazione]
           ,[ProgressivoPrenotazione]
           ,[AnnoPrenotazione]
           ,[DataInizio]
           ,[DataFine]
           ,[Giorni]
           ,[KmEstime]
           ,[Destinazione]
           ,[UsineRiva]
		   ,[GuidTable]
		   ,[IdAuto]
		   ,[InsertData])
     VALUES
           (@UtentePrenotazione
           ,@ProgressivoPrenotazione
           ,@AnnoPrenotazione
           ,@DataInizio
           ,@DataFine
           ,@Giorni
           ,@KmEstime 
           ,@Destinazione
           ,@UsineRiva
		   ,@GuidTable
		   ,@IdAuto
		   ,getdate())



END
GO
/****** Object:  StoredProcedure [dbo].[ai_insert_voyager]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[ai_insert_voyager]
	-- Add the parameters for the stored procedure here

				@GuidTable nvarchar (10),
				@Voyager nvarchar(max)

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here

INSERT INTO [dbo].[utVoyagers]
           ([GuidTable]
           ,[Voyager])
     VALUES
           (@GuidTable
           ,@Voyager)


END
GO
/****** Object:  StoredProcedure [dbo].[ai_update_auto]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Anass Imli
-- Create date: 23/05/2025
-- Description:	Pour mise a jour auto (voiture)
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[ai_update_auto]
	-- Add the parameters for the stored procedure here

			@IdModello int,
			@Targa nchar(10),
			@Rottamato int,
			@Priorite nchar(1),
			@IdAuto int

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
UPDATE [dbo].[utAuto]
   SET [IdModello] = @IdModello
      ,[Targa] = @Targa
      ,[Rottamato] = @Rottamato
	  ,[Priorite] = @Priorite
 WHERE IdAuto = @IdAuto
 
 
 
 END
GO
/****** Object:  StoredProcedure [dbo].[ai_update_donne_gardien]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		ANASS IMLI
-- Create date: 03/06/2025
-- Description:	cette PS est utilisé par le gardien à la premiere phase de remis des clés ,  
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[ai_update_donne_gardien]
	-- Add the parameters for the stored procedure here

	@NomeGuardianoConsegna nvarchar(50),
	@VerificaDocumenti bit,
	@Note text,
	@IdPrenotazione int


AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here

UPDATE [dbo].[utPrenotazioni]
   SET [NomeGuardianoConsegna] = @NomeGuardianoConsegna
      ,[VerificaDocumenti] = @VerificaDocumenti
      ,[DataConsegnaChiavi] = getdate()
      ,[Note] = @Note
 WHERE IdPrenotazione = @IdPrenotazione


END
GO
/****** Object:  StoredProcedure [dbo].[ai_update_marque]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Anass Imli
-- Create date: 15/05/2025
-- Description:	Procédure de mise à jour du nom de marque en cas d'erreur
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[ai_update_marque]
	-- Add the parameters for the stored procedure here

			@Marca nvarchar (50),
			@IdMarca int


AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here

UPDATE [dbo].[utMarche]
   SET [Marca] = @Marca
 WHERE IdMarca = @IdMarca




END
GO
/****** Object:  StoredProcedure [dbo].[ai_update_modelle]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Anass Imli	
-- Create date: 21/05/2025
-- Description:	Procédure de mise à jour du modèle
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[ai_update_modelle]
	-- Add the parameters for the stored procedure here

			@IdMarca int,
			@Modello nvarchar (50),
			@Cilindrata int,
			@IdModello int

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here

UPDATE [dbo].[utModelli]
   SET [IdMarca] = @IdMarca
      ,[Modello] = @Modello
      ,[Cilindrata] = @Cilindrata
 WHERE IdModello = @IdModello


END
GO
/****** Object:  StoredProcedure [dbo].[ai_update_rh_validation]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[ai_update_rh_validation]
	-- Add the parameters for the stored procedure here

	@IdAuto int,
	@Note text,
	@ValidationRH int,
	@DateValidation datetime,
	@IdPrenotazione int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
UPDATE [dbo].[utPrenotazioni]
   SET [IdAuto] = @IdAuto
      ,[Note] = @Note
      ,[ValidationRH] = @ValidationRH
      ,[DateValidation] = @DateValidation
 WHERE IdPrenotazione = @IdPrenotazione
 
 
 END
GO
/****** Object:  StoredProcedure [dbo].[ai_visualiser_reservation]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Anass Imli
-- Create date: 02/06/2025
-- Description:	afficher les reservations en cours pour le poste de garde 
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[ai_visualiser_reservation]
	-- Add the parameters for the stored procedure here
	


AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here

SELECT			utPrenotazioni.[IdPrenotazione],
				utPrenotazioni.IdAuto, 
				utPrenotazioni.Guidatore, 
				utPrenotazioni.ProgressivoPrenotazione, 
				utPrenotazioni.AnnoPrenotazione, 
				utPrenotazioni.DataInizio, 
				utPrenotazioni.DataFine, 
				utPrenotazioni.Destinazione, 
				utAuto.Targa, 
                utMarche.Marca, 
				utModelli.Modello
FROM            utPrenotazioni 
inner JOIN		utAuto ON utAuto.IdAuto = utPrenotazioni.IdAuto 
inner JOIN		utModelli ON utAuto.IdModello = utModelli.IdModello 
inner JOIN		utMarche ON utModelli.IdMarca = utMarche.IdMarca
--WHERE            (utPrenotazioni.DataInizio <= GETDATE()) AND (utPrenotazioni.DataFine >= GETDATE()) 



END
GO
/****** Object:  StoredProcedure [dbo].[ai_visualiser_reservation_non_restituee]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Anass Imli
-- Create date: 07/08/2025
-- Description:	afficher les reservations des voitures non restituée  pour le poste de garde 
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[ai_visualiser_reservation_non_restituee]
	-- Add the parameters for the stored procedure here
	


AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here

SELECT      utPrenotazioni.IdPrenotazione, 
			utPrenotazioni.IdAuto, 
			utPrenotazioni.UtentePrenotazione, 
			utPrenotazioni.Guidatore, 
			utPrenotazioni.ProgressivoPrenotazione, 
			utPrenotazioni.AnnoPrenotazione, 
			utPrenotazioni.DataInizio, 
            utPrenotazioni.DataFine, 
			utPrenotazioni.Giorni, 
			utPrenotazioni.NomeGuardianoConsegna, 
			utPrenotazioni.VerificaDocumenti, 
			utPrenotazioni.KmIniziali, 
			utPrenotazioni.DataConsegnaChiavi, 
			utPrenotazioni.NomeGuardianoRitiro, 
            utPrenotazioni.KmFinali, 
			utPrenotazioni.DataRitiroChiavi, 
			utPrenotazioni.Note, 
			utPrenotazioni.InsertData, 
			utPrenotazioni.KmEstime, 
			utPrenotazioni.Destinazione, 
			utPrenotazioni.UsineRiva, 
			utPrenotazioni.ValidationRH, 
            utPrenotazioni.DateValidation, 
			utPrenotazioni.DataVerificaGuardiano, 
			utPrenotazioni.GuidTable, 
			utAuto.Targa, 
			utModelli.Modello, 
			utMarche.Marca
FROM        utPrenotazioni 
INNER JOIN  utAuto ON utPrenotazioni.IdAuto = utAuto.IdAuto 
INNER JOIN  utModelli ON utAuto.IdModello = utModelli.IdModello 
INNER JOIN  utMarche ON utModelli.IdMarca = utMarche.IdMarca
WHERE        (utPrenotazioni.DataVerificaGuardiano IS NULL)
order by	utPrenotazioni.DataInizio, utPrenotazioni.DataFine


END

GO
/****** Object:  StoredProcedure [dbo].[ff_delete_modello]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[ff_delete_modello]
	-- Add the parameters for the stored procedure here

			@IdModello int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here

DELETE FROM [dbo].[utModelli]
      WHERE IdModello = @IdModello

END
GO
/****** Object:  StoredProcedure [dbo].[ff_get_auto]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Francesco Felizini
-- Create date: 25/09/2024
-- Description:	seleziona tutte le auto
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[ff_get_auto]
	-- Add the parameters for the stored procedure here
	 
	AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT [IdAuto]
	  ,[utAuto].[IdModello]
      ,[Marca]
      ,[Modello]
      ,[Targa]
	  ,[Rottamato]
	  ,[Cilindrata]
	  ,[Priorite] 
  FROM [SAM_MT_ReservationAuto].[dbo].[utAuto]
  inner join [dbo].[utModelli] on [dbo].[utModelli].IdModello = [dbo].[utAuto].IdModello
  inner join [dbo].[utMarche] on [dbo].[utMarche].IdMarca = [dbo].[utModelli].IdMarca
  ORDER BY Marca, Modello, Targa


END
GO
/****** Object:  StoredProcedure [dbo].[ff_get_auto_per_id]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Francesco Felizini
-- Create date: 25/09/2024
-- Description:	seleziona tutte le auto
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[ff_get_auto_per_id]
	-- Add the parameters for the stored procedure here

	 @IdAuto int 

	AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
SELECT [IdAuto]
      ,[IdModello]
      ,[Targa]
      ,[Rottamato]
	  ,[Priorite]
  FROM [dbo].[utAuto]
  WHERE IdAuto = @IdAuto
END
GO
/****** Object:  StoredProcedure [dbo].[ff_get_marche]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		FF
-- Create date: 25/09/2024
-- Description:	Restituisce tutte le marche delle auto
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[ff_get_marche]
	-- Add the parameters for the stored procedure here



AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here

	SELECT [IdMarca]
      ,[Marca]
  FROM [SAM_MT_ReservationAuto].[dbo].[utMarche]
  order by Marca

END
GO
/****** Object:  StoredProcedure [dbo].[ff_get_modelli]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[ff_get_modelli]
	-- Add the parameters for the stored procedure here


AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here

SELECT [IdModello]
      ,[utModelli].[IdMarca]
	  ,[Marca]
      ,[Modello]
      ,[Cilindrata]
  FROM [SAM_MT_ReservationAuto].[dbo].[utModelli]
  inner join [dbo].[utMarche] on [dbo].[utMarche].IdMarca = [dbo].[utModelli].[IdMarca]
  order by Modello



END
GO
/****** Object:  StoredProcedure [dbo].[ff_get_modelli_per_id_marca]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[ff_get_modelli_per_id_marca]
	-- Add the parameters for the stored procedure here

				@IdMarca int

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here

SELECT [IdModello]
      ,[utModelli].[IdMarca]
	  ,[Marca]
      ,[Modello]
      ,[Cilindrata]
  FROM [SAM_MT_ReservationAuto].[dbo].[utModelli]
  inner join [dbo].[utMarche] on [dbo].[utMarche].IdMarca = [dbo].[utModelli].[IdMarca]
  where [utMarche].IdMarca = @IdMarca



END
GO
/****** Object:  StoredProcedure [dbo].[ff_get_modelli_per_id_modello]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[ff_get_modelli_per_id_modello]
	-- Add the parameters for the stored procedure here

				@IdModello int

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here

SELECT [IdModello]
      ,[utModelli].[IdMarca]
	  ,[Marca]
      ,[Modello]
      ,[Cilindrata]
  FROM [SAM_MT_ReservationAuto].[dbo].[utModelli]
  inner join [dbo].[utMarche] on [dbo].[utMarche].IdMarca = [dbo].[utModelli].[IdMarca]
  where IdModello = @IdModello



END
GO
/****** Object:  StoredProcedure [dbo].[ff_insert_auto]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[ff_insert_auto]
	-- Add the parameters for the stored procedure here
	
	@IdModello int,
	@Targa nchar (10),
	@Rottamato int,
	@Priorite nchar(1)

	
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	INSERT INTO [dbo].[utAuto]
           ([IdModello]
           ,[Targa]
           ,[Rottamato]
		   ,[Priorite])
		   
     VALUES
           (@IdModello, 
           @Targa,
           @Rottamato,
		   @Priorite)
END
GO
/****** Object:  StoredProcedure [dbo].[ff_insert_marca]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Francesco Feliziani
-- Create date: 25/09/2024      
-- Description:	Procedura per inserimento marca
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[ff_insert_marca]                               
	-- Add the parameters for the stored procedure here
	@Marca nvarchar(50) 

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	INSERT INTO [dbo].[utMarche]
           ([Marca])
     VALUES
           (@Marca)
END
GO
/****** Object:  StoredProcedure [dbo].[ff_insert_modello]    Script Date: 13/04/2026 13:57:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[ff_insert_modello]
	-- Add the parameters for the stored procedure here

				@IdMarca int,
				@Modello nvarchar (50),
				@Cilindrata int

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here

INSERT INTO [dbo].[utModelli]
           ([IdMarca]
           ,[Modello]
           ,[Cilindrata])
     VALUES
           (@IdMarca
           ,@Modello
           ,@Cilindrata)

END
GO


-- =============================================
-- Stored Procedures manquantes (ajoutées pour l'API)
-- =============================================

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER PROCEDURE [dbo].[ai_delete_marque]
    @IdMarca int
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM [dbo].[utMarche] WHERE IdMarca = @IdMarca
END
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER PROCEDURE [dbo].[ai_delete_auto]
    @IdAuto int
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM [dbo].[utAuto] WHERE IdAuto = @IdAuto
END
-- Table des utilisateurs
CREATE TABLE [dbo].[utUtenti](
    [IdUtente] [int] IDENTITY(1,1) NOT NULL,
    [Username] [nvarchar](50) NOT NULL,
    [Pwd] [nvarchar](100) NOT NULL,
    [CognomeNome] [nvarchar](100) NULL,
    [Email] [nvarchar](100) NULL,
    [Role] [nvarchar](20) NOT NULL DEFAULT 'employe',
    [Attivo] [bit] NOT NULL DEFAULT 1,
    CONSTRAINT [PK_utUtenti] PRIMARY KEY ([IdUtente])
);
GO
CREATE TABLE [dbo].[utUtenti](
    [IdUtente] [int] IDENTITY(1,1) NOT NULL,
    [Username] [nvarchar](50) NOT NULL,
    [Pwd] [nvarchar](100) NOT NULL,
    [CognomeNome] [nvarchar](100) NULL,
    [Email] [nvarchar](100) NULL,
    [Role] [nvarchar](20) NOT NULL DEFAULT 'employe',
    [Attivo] [bit] NOT NULL DEFAULT 1,
    CONSTRAINT [PK_utUtenti] PRIMARY KEY ([IdUtente])
);
GO
CREATE OR ALTER PROCEDURE [dbo].[UP_GET_AUTENTICAZIONE_ESTERNA]
    @Username nvarchar(50),
    @Pwd nvarchar(100)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT IdUtente, Username, CognomeNome, Email, Role, Attivo
    FROM [dbo].[utUtenti]
    WHERE Username = @Username AND Pwd = @Pwd AND Attivo = 1
END
GO

INSERT INTO utUtenti (Username, Pwd, CognomeNome, Email, Role) VALUES
('anass.imli', 'Montereau05@@', 'IMLI Anass', 'anass.imli@rivagroup.com', 'admin');
GO
INSERT INTO utUtenti (Username, Pwd, CognomeNome, Email, Role) VALUES
('marie.dupont', 'test123', 'DUPONT Marie', 'marie.dupont@rivagroup.com', 'employe');
GO
INSERT INTO utUtenti (Username, Pwd, CognomeNome, Email, Role) VALUES
('jean.martin', 'test123', 'MARTIN Jean', 'jean.martin@rivagroup.com', 'employe');
GO
INSERT INTO utUtenti (Username, Pwd, CognomeNome, Email, Role) VALUES
('pierre.gardien', 'test123', 'GARDIEN Pierre', 'pierre.gardien@rivagroup.com', 'gardien');
GO
INSERT INTO utUtenti (Username, Pwd, CognomeNome, Email, Role) VALUES
('sophie.rh', 'test123', 'RH Sophie', 'sophie.rh@rivagroup.com', 'rh');
GO
GO