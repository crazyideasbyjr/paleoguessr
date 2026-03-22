import { useState, useEffect } from "react";

// ============================================================
// SPECIES DATABASE
// lineage: ordered array from broadest → most specific
// Each entry: { rank, value }
// This is the source of truth for the cladogram and scoring.
// To add a species: copy the pattern, fill in full lineage from
// kingdom down to genus. Use real intermediate groups (Theropoda etc.)
// ============================================================
const SPECIES_DB = [
  {
    id: 1, name: "Tyrannosaurus rex (T. rex)",
    periodName: "Late Cretaceous", periodStart: 68, periodEnd: 66,
    wikiSlug: "Tyrannosaurus",
    lineage: [
      { rank: "Kingdom",     value: "Animalia" },
      { rank: "Phylum",      value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",       value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",       value: "Dinosauria" },
      { rank: "Order",       value: "Saurischia" },
      { rank: "Clade",       value: "Theropoda" },
      { rank: "Clade",       value: "Tetanurae" },
      { rank: "Clade",       value: "Coelurosauria" },
      { rank: "Clade",       value: "Tyrannosauroidea" },
      { rank: "Family",      value: "Tyrannosauridae" },
      { rank: "Genus",       value: "Tyrannosaurus" },
    ]
  },
  {
    id: 2, name: "Triceratops",
    periodName: "Late Cretaceous", periodStart: 68, periodEnd: 66,
    wikiSlug: "Triceratops",
    lineage: [
      { rank: "Kingdom",     value: "Animalia" },
      { rank: "Phylum",      value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",       value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",       value: "Dinosauria" },
      { rank: "Order",       value: "Ornithischia" },
      { rank: "Clade",     value: "Cerapoda" },
      { rank: "Clade",     value: "Marginocephalia" },
      { rank: "Clade",       value: "Ceratopsia" },
      { rank: "Family",      value: "Ceratopsidae" },
      { rank: "Genus",       value: "Triceratops" },
    ]
  },
  {
    id: 3, name: "Brachiosaurus",
    periodName: "Late Jurassic", periodStart: 154, periodEnd: 150,
    wikiSlug: "Brachiosaurus",
    lineage: [
      { rank: "Kingdom",     value: "Animalia" },
      { rank: "Phylum",      value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",       value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",       value: "Dinosauria" },
      { rank: "Order",       value: "Saurischia" },
      { rank: "Clade",       value: "Sauropodomorpha" },
      { rank: "Clade",       value: "Sauropoda" },
      { rank: "Clade",     value: "Eusauropoda" },
      { rank: "Clade",     value: "Macronaria" },
      { rank: "Clade",     value: "Titanosauriformes" },
      { rank: "Family",      value: "Brachiosauridae" },
      { rank: "Genus",       value: "Brachiosaurus" },
    ]
  },
  {
    id: 4, name: "Stegosaurus",
    periodName: "Late Jurassic", periodStart: 155, periodEnd: 150,
    wikiSlug: "Stegosaurus",
    lineage: [
      { rank: "Kingdom",     value: "Animalia" },
      { rank: "Phylum",      value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",       value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",       value: "Dinosauria" },
      { rank: "Order",       value: "Ornithischia" },
      { rank: "Clade",       value: "Thyreophora" },
      { rank: "Clade",       value: "Stegosauria" },
      { rank: "Family",      value: "Stegosauridae" },
      { rank: "Genus",       value: "Stegosaurus" },
    ]
  },
  {
    id: 5, name: "Megalodon",
    periodName: "Miocene–Pliocene", periodStart: 23, periodEnd: 3.6,
    wikiSlug: "Megalodon",
    lineage: [
      { rank: "Kingdom",     value: "Animalia" },
      { rank: "Phylum",      value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Class",       value: "Chondrichthyes" },
      { rank: "Clade",     value: "Elasmobranchii" },
      { rank: "Order",       value: "Lamniformes" },
      { rank: "Family",      value: "Otodontidae" },
      { rank: "Genus",       value: "Otodus" },
    ]
  },
  {
    id: 6, name: "Anomalocaris",
    periodName: "Cambrian", periodStart: 520, periodEnd: 505,
    wikiSlug: "Anomalocaris",
    lineage: [
      { rank: "Kingdom",     value: "Animalia" },
      { rank: "Phylum",      value: "Arthropoda" },
      { rank: "Class",       value: "Dinocaridida" },
      { rank: "Order",       value: "Radiodonta" },
      { rank: "Family",      value: "Anomalocarididae" },
      { rank: "Genus",       value: "Anomalocaris" },
    ]
  },
  {
    id: 7, name: "Woolly Mammoth",
    periodName: "Pleistocene", periodStart: 0.4, periodEnd: 0.004,
    wikiSlug: "Woolly_mammoth",
    lineage: [
      { rank: "Kingdom",     value: "Animalia" },
      { rank: "Phylum",      value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",       value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Afrotheria" },
      { rank: "Order",       value: "Proboscidea" },
      { rank: "Clade",     value: "Elephantiformes" },
      { rank: "Clade",     value: "Elephantoidea" },
      { rank: "Family",      value: "Elephantidae" },
      { rank: "Genus",       value: "Mammuthus" },
    ]
  },
  {
    id: 8, name: "Saber-toothed Cat (Smilodon)",
    periodName: "Pleistocene", periodStart: 2.5, periodEnd: 0.01,
    wikiSlug: "Smilodon",
    lineage: [
      { rank: "Kingdom",     value: "Animalia" },
      { rank: "Phylum",      value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",       value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",       value: "Carnivora" },
      { rank: "Clade",       value: "Feliformia" },
      { rank: "Family",      value: "Felidae" },
      { rank: "Subfamily",   value: "Machairodontinae" },
      { rank: "Genus",       value: "Smilodon" },
    ]
  },
  {
    id: 9, name: "Dunkleosteus",
    periodName: "Late Devonian", periodStart: 382, periodEnd: 358,
    wikiSlug: "Dunkleosteus",
    lineage: [
      { rank: "Kingdom",     value: "Animalia" },
      { rank: "Phylum",      value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Class",       value: "Placodermi" },
      { rank: "Order",       value: "Arthrodira" },
      { rank: "Family",      value: "Dunkleosteidae" },
      { rank: "Genus",       value: "Dunkleosteus" },
    ]
  },
  {
    id: 10, name: "Pteranodon",
    periodName: "Late Cretaceous", periodStart: 86, periodEnd: 84,
    wikiSlug: "Pteranodon",
    lineage: [
      { rank: "Kingdom",     value: "Animalia" },
      { rank: "Phylum",      value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",       value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",       value: "Avemetatarsalia" },
      { rank: "Order",       value: "Pterosauria" },
      { rank: "Clade",       value: "Pterodactyloidea" },
      { rank: "Family",      value: "Pteranodontidae" },
      { rank: "Genus",       value: "Pteranodon" },
    ]
  },
  {
    id: 11, name: "Ichthyosaurus",
    periodName: "Early Jurassic", periodStart: 200, periodEnd: 175,
    wikiSlug: "Ichthyosaurus",
    lineage: [
      { rank: "Kingdom",     value: "Animalia" },
      { rank: "Phylum",      value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",       value: "Reptilia" },
      { rank: "Clade",     value: "Diapsida" },
      { rank: "Clade",     value: "Ichthyopterygia" },
      { rank: "Order",       value: "Ichthyosauria" },
      { rank: "Family",      value: "Ichthyosauridae" },
      { rank: "Genus",       value: "Ichthyosaurus" },
    ]
  },
  {
    id: 12, name: "Trilobite",
    periodName: "Cambrian–Permian", periodStart: 521, periodEnd: 252,
    wikiSlug: "Trilobite",
    lineage: [
      { rank: "Kingdom",     value: "Animalia" },
      { rank: "Phylum",      value: "Arthropoda" },
      { rank: "Class",       value: "Trilobita" },
    ]
  },
  {
    id: 13, name: "Velociraptor",
    periodName: "Late Cretaceous", periodStart: 75, periodEnd: 71,
    wikiSlug: "Velociraptor",
    lineage: [
      { rank: "Kingdom",     value: "Animalia" },
      { rank: "Phylum",      value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",       value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",       value: "Dinosauria" },
      { rank: "Order",       value: "Saurischia" },
      { rank: "Clade",       value: "Theropoda" },
      { rank: "Clade",       value: "Tetanurae" },
      { rank: "Clade",       value: "Coelurosauria" },
      { rank: "Clade",       value: "Maniraptora" },
      { rank: "Family",      value: "Dromaeosauridae" },
      { rank: "Genus",       value: "Velociraptor" },
    ]
  },
  {
    id: 14, name: "Diplodocus",
    periodName: "Late Jurassic", periodStart: 154, periodEnd: 152,
    wikiSlug: "Diplodocus",
    lineage: [
      { rank: "Kingdom",     value: "Animalia" },
      { rank: "Phylum",      value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",       value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",       value: "Dinosauria" },
      { rank: "Order",       value: "Saurischia" },
      { rank: "Clade",       value: "Sauropodomorpha" },
      { rank: "Clade",       value: "Sauropoda" },
      { rank: "Clade",     value: "Eusauropoda" },
      { rank: "Clade",     value: "Diplodocoidea" },
      { rank: "Family",      value: "Diplodocidae" },
      { rank: "Genus",       value: "Diplodocus" },
    ]
  },
  {
    id: 15, name: "Mosasaurus",
    periodName: "Late Cretaceous", periodStart: 82, periodEnd: 66,
    wikiSlug: "Mosasaurus",
    lineage: [
      { rank: "Kingdom",     value: "Animalia" },
      { rank: "Phylum",      value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",       value: "Reptilia" },
      { rank: "Clade",     value: "Diapsida" },
      { rank: "Order",       value: "Squamata" },
      { rank: "Clade",       value: "Mosasauria" },
      { rank: "Family",      value: "Mosasauridae" },
      { rank: "Genus",       value: "Mosasaurus" },
    ]
  },
  // ── BATCH 2 ──────────────────────────────────────────────────
  {
    id: 16, name: "Hallucigenia",
    periodName: "Middle Cambrian", periodStart: 508, periodEnd: 500,
    wikiSlug: "Hallucigenia",
    lineage: [
      { rank: "Kingdom",  value: "Animalia" },
      { rank: "Phylum",   value: "Arthropoda" },
      { rank: "Clade",    value: "Panarthropoda" },
      { rank: "Clade",    value: "Lobopoda" },
      { rank: "Family",   value: "Hallucigeniidae" },
      { rank: "Genus",    value: "Hallucigenia" },
    ]
  },
  {
    id: 17, name: "Opabinia",
    periodName: "Middle Cambrian", periodStart: 508, periodEnd: 501,
    wikiSlug: "Opabinia",
    lineage: [
      { rank: "Kingdom",  value: "Animalia" },
      { rank: "Phylum",   value: "Arthropoda" },
      { rank: "Class",    value: "Dinocaridida" },
      { rank: "Order",    value: "Radiodonta" },
      { rank: "Family",   value: "Opabiniidae" },
      { rank: "Genus",    value: "Opabinia" },
    ]
  },
  {
    id: 18, name: "Cameroceras",
    periodName: "Ordovician", periodStart: 470, periodEnd: 444,
    wikiSlug: "Cameroceras",
    lineage: [
      { rank: "Kingdom",  value: "Animalia" },
      { rank: "Phylum",   value: "Mollusca" },
      { rank: "Class",    value: "Cephalopoda" },
      { rank: "Subclass", value: "Nautiloidea" },
      { rank: "Order",    value: "Endocerida" },
      { rank: "Family",   value: "Endoceratidae" },
      { rank: "Genus",    value: "Cameroceras" },
    ]
  },
  {
    id: 19, name: "Pterygotus",
    periodName: "Silurian–Devonian", periodStart: 428, periodEnd: 391,
    wikiSlug: "Pterygotus",
    lineage: [
      { rank: "Kingdom",  value: "Animalia" },
      { rank: "Phylum",   value: "Arthropoda" },
      { rank: "Subphylum", value: "Chelicerata" },
      { rank: "Class",    value: "Merostomata" },
      { rank: "Order",    value: "Eurypterida" },
      { rank: "Superfamily", value: "Pterygotioidea" },
      { rank: "Family",   value: "Pterygotidae" },
      { rank: "Genus",    value: "Pterygotus" },
    ]
  },
  {
    id: 20, name: "Tiktaalik",
    periodName: "Late Devonian", periodStart: 383, periodEnd: 374,
    wikiSlug: "Tiktaalik",
    lineage: [
      { rank: "Kingdom",  value: "Animalia" },
      { rank: "Phylum",   value: "Chordata" },
      { rank: "Clade",    value: "Osteichthyes" },
      { rank: "Clade",    value: "Sarcopterygii" },
      { rank: "Clade",    value: "Tetrapodomorpha" },
      { rank: "Clade",    value: "Elpistostegalia" },
      { rank: "Family",   value: "Elpistostegidae" },
      { rank: "Genus",    value: "Tiktaalik" },
    ]
  },
  {
    id: 21, name: "Acanthostega",
    periodName: "Late Devonian", periodStart: 367, periodEnd: 362,
    wikiSlug: "Acanthostega",
    lineage: [
      { rank: "Kingdom",  value: "Animalia" },
      { rank: "Phylum",   value: "Chordata" },
      { rank: "Clade",    value: "Osteichthyes" },
      { rank: "Clade",    value: "Sarcopterygii" },
      { rank: "Clade",    value: "Tetrapodomorpha" },
      { rank: "Clade",    value: "Tetrapoda" },
      { rank: "Family",   value: "Acanthostegidae" },
      { rank: "Genus",    value: "Acanthostega" },
    ]
  },
  {
    id: 22, name: "Arthropleura (Giant Millipede)",
    periodName: "Carboniferous–Early Permian", periodStart: 346, periodEnd: 290,
    wikiSlug: "Arthropleura",
    lineage: [
      { rank: "Kingdom",  value: "Animalia" },
      { rank: "Phylum",   value: "Arthropoda" },
      { rank: "Subphylum", value: "Myriapoda" },
      { rank: "Class",    value: "Diplopoda" },
      { rank: "Subclass", value: "Arthropleuridea" },
      { rank: "Order",    value: "Arthropleurida" },
      { rank: "Family",   value: "Arthropleuridae" },
      { rank: "Genus",    value: "Arthropleura" },
    ]
  },
  // ── BATCH 3 ──────────────────────────────────────────────────
  {
    id: 23, name: "Meganeura",
    periodName: "Late Carboniferous", periodStart: 307, periodEnd: 299,
    wikiSlug: "Meganeura",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Arthropoda" },
      { rank: "Class",     value: "Insecta" },
      { rank: "Clade",     value: "Pterygota" },
      { rank: "Clade",     value: "Odonatoptera" },
      { rank: "Order",     value: "Meganisoptera" },
      { rank: "Family",    value: "Meganeuridae" },
      { rank: "Genus",     value: "Meganeura" },
    ]
  },
  {
    id: 24, name: "Dimetrodon",
    periodName: "Early Permian", periodStart: 295, periodEnd: 272,
    wikiSlug: "Dimetrodon",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Clade",     value: "Eupelycosauria" },
      { rank: "Clade",     value: "Sphenacodontia" },
      { rank: "Family",    value: "Sphenacodontidae" },
      { rank: "Genus",     value: "Dimetrodon" },
    ]
  },
  {
    id: 25, name: "Edaphosaurus",
    periodName: "Late Carboniferous–Early Permian", periodStart: 304, periodEnd: 272,
    wikiSlug: "Edaphosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Clade",     value: "Eupelycosauria" },
      { rank: "Family",    value: "Edaphosauridae" },
      { rank: "Genus",     value: "Edaphosaurus" },
    ]
  },
  {
    id: 26, name: "Inostrancevia",
    periodName: "Late Permian", periodStart: 259, periodEnd: 252,
    wikiSlug: "Inostrancevia",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Order",     value: "Therapsida" },
      { rank: "Clade",     value: "Theriodontia" },
      { rank: "Suborder",  value: "Gorgonopsia" },
      { rank: "Family",    value: "Gorgonopsidae" },
      { rank: "Genus",     value: "Inostrancevia" },
    ]
  },
  {
    id: 27, name: "Scutosaurus",
    periodName: "Late Permian", periodStart: 259, periodEnd: 252,
    wikiSlug: "Scutosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Parareptilia" },
      { rank: "Order",     value: "Pareiasauria" },
      { rank: "Family",    value: "Pareiasauridae" },
      { rank: "Genus",     value: "Scutosaurus" },
    ]
  },
  {
    id: 28, name: "Diplocaulus",
    periodName: "Late Carboniferous–Late Permian", periodStart: 306, periodEnd: 255,
    wikiSlug: "Diplocaulus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Class",     value: "Amphibia" },
      { rank: "Subclass",  value: "Lepospondyli" },
      { rank: "Order",     value: "Nectridea" },
      { rank: "Family",    value: "Diplocaulidae" },
      { rank: "Genus",     value: "Diplocaulus" },
    ]
  },
  {
    id: 29, name: "Helicoprion (Buzzsaw Shark)",
    periodName: "Early–Middle Permian", periodStart: 290, periodEnd: 270,
    wikiSlug: "Helicoprion",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Class",     value: "Chondrichthyes" },
      { rank: "Subclass",  value: "Holocephali" },
      { rank: "Order",     value: "Eugeneodontiformes" },
      { rank: "Superfamily", value: "Edestoidea" },
      { rank: "Family",    value: "Helicoprionidae" },
      { rank: "Genus",     value: "Helicoprion" },
    ]
  },
  {
    id: 30, name: "Seymouria",
    periodName: "Early Permian", periodStart: 299, periodEnd: 272,
    wikiSlug: "Seymouria",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Reptiliomorpha" },
      { rank: "Order",     value: "Seymouriamorpha" },
      { rank: "Family",    value: "Seymouriidae" },
      { rank: "Genus",     value: "Seymouria" },
    ]
  },
  {
    id: 31, name: "Eryops",
    periodName: "Late Carboniferous–Early Permian", periodStart: 300, periodEnd: 285,
    wikiSlug: "Eryops",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Class",     value: "Amphibia" },
      { rank: "Order",     value: "Temnospondyli" },
      { rank: "Clade",     value: "Euskelia" },
      { rank: "Superfamily", value: "Eryopoidea" },
      { rank: "Family",    value: "Eryopidae" },
      { rank: "Genus",     value: "Eryops" },
    ]
  },
  {
    id: 32, name: "Platybelodon",
    periodName: "Middle Miocene", periodStart: 15, periodEnd: 9,
    wikiSlug: "Platybelodon",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Afrotheria" },
      { rank: "Order",     value: "Proboscidea" },
      { rank: "Family",    value: "Amebelodontidae" },
      { rank: "Genus",     value: "Platybelodon" },
    ]
  },
  {
    id: 33, name: "Estemmenosuchus",
    periodName: "Middle Permian", periodStart: 270, periodEnd: 260,
    wikiSlug: "Estemmenosuchus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Order",     value: "Therapsida" },
      { rank: "Suborder",  value: "Dinocephalia" },
      { rank: "Family",    value: "Estemmenosuchidae" },
      { rank: "Genus",     value: "Estemmenosuchus" },
    ]
  },
  // ── BATCH 4 ──────────────────────────────────────────────────
  {
    id: 34, name: "Spinosaurus",
    periodName: "Late Cretaceous", periodStart: 99, periodEnd: 93,
    wikiSlug: "Spinosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Megalosauroidea" },
      { rank: "Family",    value: "Spinosauridae" },
      { rank: "Subfamily", value: "Spinosaurinae" },
      { rank: "Genus",     value: "Spinosaurus" },
    ]
  },
  {
    id: 35, name: "Allosaurus",
    periodName: "Late Jurassic", periodStart: 155, periodEnd: 145,
    wikiSlug: "Allosaurus",
    lineage: [
      { rank: "Kingdom",     value: "Animalia" },
      { rank: "Phylum",      value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",       value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",       value: "Dinosauria" },
      { rank: "Order",       value: "Saurischia" },
      { rank: "Clade",       value: "Theropoda" },
      { rank: "Clade",       value: "Tetanurae" },
      { rank: "Clade",       value: "Avetheropoda" },
      { rank: "Clade",       value: "Carnosauria" },
      { rank: "Superfamily", value: "Allosauroidea" },
      { rank: "Family",      value: "Allosauridae" },
      { rank: "Genus",       value: "Allosaurus" },
    ]
  },
  {
    id: 36, name: "Giganotosaurus",
    periodName: "Late Cretaceous", periodStart: 99, periodEnd: 95,
    wikiSlug: "Giganotosaurus",
    lineage: [
      { rank: "Kingdom",     value: "Animalia" },
      { rank: "Phylum",      value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",       value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",       value: "Dinosauria" },
      { rank: "Order",       value: "Saurischia" },
      { rank: "Clade",       value: "Theropoda" },
      { rank: "Clade",       value: "Tetanurae" },
      { rank: "Clade",       value: "Avetheropoda" },
      { rank: "Clade",       value: "Carnosauria" },
      { rank: "Superfamily", value: "Allosauroidea" },
      { rank: "Family",      value: "Carcharodontosauridae" },
      { rank: "Genus",       value: "Giganotosaurus" },
    ]
  },
  {
    id: 37, name: "Carnotaurus",
    periodName: "Late Cretaceous", periodStart: 72, periodEnd: 69,
    wikiSlug: "Carnotaurus",
    lineage: [
      { rank: "Kingdom",     value: "Animalia" },
      { rank: "Phylum",      value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",       value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",       value: "Dinosauria" },
      { rank: "Order",       value: "Saurischia" },
      { rank: "Clade",       value: "Theropoda" },
      { rank: "Clade",       value: "Ceratosauria" },
      { rank: "Superfamily", value: "Abelisauroidea" },
      { rank: "Family",      value: "Abelisauridae" },
      { rank: "Genus",       value: "Carnotaurus" },
    ]
  },
  {
    id: 38, name: "Deinonychus",
    periodName: "Early Cretaceous", periodStart: 115, periodEnd: 108,
    wikiSlug: "Deinonychus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Family",    value: "Dromaeosauridae" },
      { rank: "Subfamily", value: "Velociraptorinae" },
      { rank: "Genus",     value: "Deinonychus" },
    ]
  },
  {
    id: 39, name: "Dilophosaurus",
    periodName: "Early Jurassic", periodStart: 193, periodEnd: 183,
    wikiSlug: "Dilophosaurus",
    lineage: [
      { rank: "Kingdom", value: "Animalia" },
      { rank: "Phylum",  value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",   value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",   value: "Dinosauria" },
      { rank: "Order",   value: "Saurischia" },
      { rank: "Clade",   value: "Theropoda" },
      { rank: "Clade",   value: "Neotheropoda" },
      { rank: "Family",  value: "Dilophosauridae" },
      { rank: "Genus",   value: "Dilophosaurus" },
    ]
  },
  {
    id: 40, name: "Utahraptor",
    periodName: "Early Cretaceous", periodStart: 139, periodEnd: 134,
    wikiSlug: "Utahraptor",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Family",    value: "Dromaeosauridae" },
      { rank: "Subfamily", value: "Dromaeosaurinae" },
      { rank: "Genus",     value: "Utahraptor" },
    ]
  },
  {
    id: 41, name: "Baryonyx",
    periodName: "Early Cretaceous", periodStart: 130, periodEnd: 125,
    wikiSlug: "Baryonyx",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Megalosauroidea" },
      { rank: "Family",    value: "Spinosauridae" },
      { rank: "Subfamily", value: "Baryonychinae" },
      { rank: "Genus",     value: "Baryonyx" },
    ]
  },
  // ── BATCH 5 ──────────────────────────────────────────────────
  {
    id: 42, name: "Therizinosaurus",
    periodName: "Late Cretaceous", periodStart: 80, periodEnd: 66,
    wikiSlug: "Therizinosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Clade",     value: "Therizinosauria" },
      { rank: "Family",    value: "Therizinosauridae" },
      { rank: "Genus",     value: "Therizinosaurus" },
    ]
  },
  {
    id: 43, name: "Archaeopteryx",
    periodName: "Late Jurassic", periodStart: 150, periodEnd: 148,
    wikiSlug: "Archaeopteryx",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Clade",     value: "Avialae" },
      { rank: "Family",    value: "Archaeopterygidae" },
      { rank: "Genus",     value: "Archaeopteryx" },
    ]
  },
  {
    id: 44, name: "Ceratosaurus",
    periodName: "Late Jurassic", periodStart: 153, periodEnd: 148,
    wikiSlug: "Ceratosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Theropoda" },
      { rank: "Clade",     value: "Ceratosauria" },
      { rank: "Family",    value: "Ceratosauridae" },
      { rank: "Genus",     value: "Ceratosaurus" },
    ]
  },
  {
    id: 45, name: "Compsognathus",
    periodName: "Late Jurassic", periodStart: 150, periodEnd: 145,
    wikiSlug: "Compsognathus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Family",    value: "Compsognathidae" },
      { rank: "Genus",     value: "Compsognathus" },
    ]
  },
  {
    id: 46, name: "Troodon",
    periodName: "Late Cretaceous", periodStart: 77, periodEnd: 66,
    wikiSlug: "Troodon",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Clade",     value: "Paraves" },
      { rank: "Family",    value: "Troodontidae" },
      { rank: "Genus",     value: "Troodon" },
    ]
  },
  {
    id: 47, name: "Argentinosaurus",
    periodName: "Late Cretaceous", periodStart: 96, periodEnd: 92,
    wikiSlug: "Argentinosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Sauropodomorpha" },
      { rank: "Clade",     value: "Sauropoda" },
      { rank: "Clade",     value: "Eusauropoda" },
      { rank: "Clade",     value: "Macronaria" },
      { rank: "Clade",     value: "Titanosauriformes" },
      { rank: "Clade",     value: "Titanosauria" },
      { rank: "Clade",     value: "Lognkosauria" },
      { rank: "Genus",     value: "Argentinosaurus" },
    ]
  },
  {
    id: 48, name: "Apatosaurus",
    periodName: "Late Jurassic", periodStart: 152, periodEnd: 151,
    wikiSlug: "Apatosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Sauropodomorpha" },
      { rank: "Clade",     value: "Sauropoda" },
      { rank: "Clade",     value: "Diplodocoidea" },
      { rank: "Family",    value: "Diplodocidae" },
      { rank: "Subfamily", value: "Apatosaurinae" },
      { rank: "Genus",     value: "Apatosaurus" },
    ]
  },
  {
    id: 49, name: "Dreadnoughtus",
    periodName: "Late Cretaceous", periodStart: 79, periodEnd: 77,
    wikiSlug: "Dreadnoughtus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Sauropodomorpha" },
      { rank: "Clade",     value: "Sauropoda" },
      { rank: "Clade",     value: "Eusauropoda" },
      { rank: "Clade",     value: "Macronaria" },
      { rank: "Clade",     value: "Titanosauriformes" },
      { rank: "Clade",     value: "Titanosauria" },
      { rank: "Genus",     value: "Dreadnoughtus" },
    ]
  },
  {
    id: 50, name: "Amargasaurus",
    periodName: "Early Cretaceous", periodStart: 129, periodEnd: 122,
    wikiSlug: "Amargasaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Sauropodomorpha" },
      { rank: "Clade",     value: "Sauropoda" },
      { rank: "Clade",     value: "Diplodocoidea" },
      { rank: "Family",    value: "Dicraeosauridae" },
      { rank: "Genus",     value: "Amargasaurus" },
    ]
  },
  {
    id: 51, name: "Patagotitan",
    periodName: "Early–Late Cretaceous", periodStart: 101, periodEnd: 95,
    wikiSlug: "Patagotitan",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Sauropodomorpha" },
      { rank: "Clade",     value: "Sauropoda" },
      { rank: "Clade",     value: "Eusauropoda" },
      { rank: "Clade",     value: "Macronaria" },
      { rank: "Clade",     value: "Titanosauriformes" },
      { rank: "Clade",     value: "Titanosauria" },
      { rank: "Clade",     value: "Lognkosauria" },
      { rank: "Genus",     value: "Patagotitan" },
    ]
  },
  // ── BATCH 6 ──────────────────────────────────────────────────
  {
    id: 52, name: "Ankylosaurus",
    periodName: "Late Cretaceous", periodStart: 70, periodEnd: 66,
    wikiSlug: "Ankylosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Ornithischia" },
      { rank: "Clade",     value: "Thyreophora" },
      { rank: "Clade",     value: "Ankylosauria" },
      { rank: "Family",    value: "Ankylosauridae" },
      { rank: "Genus",     value: "Ankylosaurus" },
    ]
  },
  {
    id: 53, name: "Parasaurolophus",
    periodName: "Late Cretaceous", periodStart: 76, periodEnd: 73,
    wikiSlug: "Parasaurolophus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Ornithischia" },
      { rank: "Clade",     value: "Cerapoda" },
      { rank: "Clade",     value: "Ornithopoda" },
      { rank: "Family",    value: "Hadrosauridae" },
      { rank: "Subfamily", value: "Lambeosaurinae" },
      { rank: "Genus",     value: "Parasaurolophus" },
    ]
  },
  {
    id: 54, name: "Pachycephalosaurus",
    periodName: "Late Cretaceous", periodStart: 70, periodEnd: 66,
    wikiSlug: "Pachycephalosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Ornithischia" },
      { rank: "Clade",     value: "Cerapoda" },
      { rank: "Clade",     value: "Marginocephalia" },
      { rank: "Order",     value: "Pachycephalosauria" },
      { rank: "Family",    value: "Pachycephalosauridae" },
      { rank: "Genus",     value: "Pachycephalosaurus" },
    ]
  },
  {
    id: 55, name: "Iguanodon",
    periodName: "Early Cretaceous", periodStart: 126, periodEnd: 113,
    wikiSlug: "Iguanodon",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Ornithischia" },
      { rank: "Clade",     value: "Cerapoda" },
      { rank: "Clade",     value: "Ornithopoda" },
      { rank: "Clade",     value: "Iguanodontia" },
      { rank: "Family",    value: "Iguanodontidae" },
      { rank: "Genus",     value: "Iguanodon" },
    ]
  },
  {
    id: 56, name: "Styracosaurus",
    periodName: "Late Cretaceous", periodStart: 75, periodEnd: 73,
    wikiSlug: "Styracosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Ornithischia" },
      { rank: "Clade",     value: "Cerapoda" },
      { rank: "Clade",     value: "Marginocephalia" },
      { rank: "Clade",     value: "Ceratopsia" },
      { rank: "Family",    value: "Ceratopsidae" },
      { rank: "Subfamily", value: "Centrosaurinae" },
      { rank: "Genus",     value: "Styracosaurus" },
    ]
  },
  {
    id: 57, name: "Edmontosaurus",
    periodName: "Late Cretaceous", periodStart: 73, periodEnd: 66,
    wikiSlug: "Edmontosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Ornithischia" },
      { rank: "Clade",     value: "Cerapoda" },
      { rank: "Clade",     value: "Ornithopoda" },
      { rank: "Family",    value: "Hadrosauridae" },
      { rank: "Subfamily", value: "Saurolophinae" },
      { rank: "Genus",     value: "Edmontosaurus" },
    ]
  },
  {
    id: 58, name: "Euoplocephalus",
    periodName: "Late Cretaceous", periodStart: 76, periodEnd: 70,
    wikiSlug: "Euoplocephalus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Ornithischia" },
      { rank: "Clade",     value: "Thyreophora" },
      { rank: "Clade",     value: "Ankylosauria" },
      { rank: "Family",    value: "Ankylosauridae" },
      { rank: "Genus",     value: "Euoplocephalus" },
    ]
  },
  {
    id: 59, name: "Protoceratops",
    periodName: "Late Cretaceous", periodStart: 75, periodEnd: 71,
    wikiSlug: "Protoceratops",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Ornithischia" },
      { rank: "Clade",     value: "Cerapoda" },
      { rank: "Clade",     value: "Marginocephalia" },
      { rank: "Clade",     value: "Ceratopsia" },
      { rank: "Family",    value: "Protoceratopsidae" },
      { rank: "Genus",     value: "Protoceratops" },
    ]
  },
  {
    id: 60, name: "Maiasaura",
    periodName: "Late Cretaceous", periodStart: 80, periodEnd: 74,
    wikiSlug: "Maiasaura",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Ornithischia" },
      { rank: "Clade",     value: "Cerapoda" },
      { rank: "Clade",     value: "Ornithopoda" },
      { rank: "Family",    value: "Hadrosauridae" },
      { rank: "Subfamily", value: "Saurolophinae" },
      { rank: "Genus",     value: "Maiasaura" },
    ]
  },
  {
    id: 61, name: "Corythosaurus",
    periodName: "Late Cretaceous", periodStart: 77, periodEnd: 75,
    wikiSlug: "Corythosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Ornithischia" },
      { rank: "Clade",     value: "Cerapoda" },
      { rank: "Clade",     value: "Ornithopoda" },
      { rank: "Family",    value: "Hadrosauridae" },
      { rank: "Subfamily", value: "Lambeosaurinae" },
      { rank: "Genus",     value: "Corythosaurus" },
    ]
  },
  {
    id: 62, name: "Kentrosaurus",
    periodName: "Late Jurassic", periodStart: 152, periodEnd: 145,
    wikiSlug: "Kentrosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Ornithischia" },
      { rank: "Clade",     value: "Thyreophora" },
      { rank: "Clade",     value: "Stegosauria" },
      { rank: "Family",    value: "Stegosauridae" },
      { rank: "Genus",     value: "Kentrosaurus" },
    ]
  },
  // ── BATCH 7 ──────────────────────────────────────────────────
  {
    id: 63, name: "Pterodactylus",
    periodName: "Late Jurassic", periodStart: 151, periodEnd: 148,
    wikiSlug: "Pterodactylus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Avemetatarsalia" },
      { rank: "Order",     value: "Pterosauria" },
      { rank: "Clade",     value: "Pterodactyloidea" },
      { rank: "Clade",     value: "Archaeopterodactyloidea" },
      { rank: "Family",    value: "Pterodactylidae" },
      { rank: "Genus",     value: "Pterodactylus" },
    ]
  },
  {
    id: 64, name: "Quetzalcoatlus",
    periodName: "Late Cretaceous", periodStart: 68, periodEnd: 66,
    wikiSlug: "Quetzalcoatlus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Avemetatarsalia" },
      { rank: "Order",     value: "Pterosauria" },
      { rank: "Clade",     value: "Pterodactyloidea" },
      { rank: "Clade",     value: "Azhdarchoidea" },
      { rank: "Family",    value: "Azhdarchidae" },
      { rank: "Genus",     value: "Quetzalcoatlus" },
    ]
  },
  {
    id: 65, name: "Dimorphodon",
    periodName: "Early Jurassic", periodStart: 196, periodEnd: 183,
    wikiSlug: "Dimorphodon",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Avemetatarsalia" },
      { rank: "Order",     value: "Pterosauria" },
      { rank: "Clade",     value: "Macronychoptera" },
      { rank: "Family",    value: "Dimorphodontidae" },
      { rank: "Genus",     value: "Dimorphodon" },
    ]
  },
  {
    id: 66, name: "Plesiosaurus",
    periodName: "Early Jurassic", periodStart: 200, periodEnd: 175,
    wikiSlug: "Plesiosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Diapsida" },
      { rank: "Clade",     value: "Sauropterygia" },
      { rank: "Order",     value: "Plesiosauria" },
      { rank: "Suborder",  value: "Plesiosauroidea" },
      { rank: "Family",    value: "Plesiosauridae" },
      { rank: "Genus",     value: "Plesiosaurus" },
    ]
  },
  {
    id: 67, name: "Liopleurodon",
    periodName: "Middle–Late Jurassic", periodStart: 166, periodEnd: 155,
    wikiSlug: "Liopleurodon",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Diapsida" },
      { rank: "Clade",     value: "Sauropterygia" },
      { rank: "Order",     value: "Plesiosauria" },
      { rank: "Suborder",  value: "Pliosauroidea" },
      { rank: "Clade",     value: "Thalassophonea" },
      { rank: "Family",    value: "Pliosauridae" },
      { rank: "Genus",     value: "Liopleurodon" },
    ]
  },
  {
    id: 68, name: "Shastasaurus",
    periodName: "Late Triassic", periodStart: 237, periodEnd: 210,
    wikiSlug: "Shastasaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Diapsida" },
      { rank: "Clade",     value: "Ichthyopterygia" },
      { rank: "Order",     value: "Ichthyosauria" },
      { rank: "Clade",     value: "Merriamosauria" },
      { rank: "Clade",     value: "Parvipelvia" },
      { rank: "Family",    value: "Shastasauridae" },
      { rank: "Genus",     value: "Shastasaurus" },
    ]
  },
  {
    id: 69, name: "Elasmosaurus",
    periodName: "Late Cretaceous", periodStart: 80, periodEnd: 77,
    wikiSlug: "Elasmosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Diapsida" },
      { rank: "Clade",     value: "Sauropterygia" },
      { rank: "Order",     value: "Plesiosauria" },
      { rank: "Suborder",  value: "Plesiosauroidea" },
      { rank: "Family",    value: "Elasmosauridae" },
      { rank: "Genus",     value: "Elasmosaurus" },
    ]
  },
  {
    id: 70, name: "Archelon",
    periodName: "Late Cretaceous", periodStart: 80, periodEnd: 74,
    wikiSlug: "Archelon",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Diapsida" },
      { rank: "Order",     value: "Testudines" },
      { rank: "Suborder",  value: "Cryptodira" },
      { rank: "Superfamily", value: "Chelonioidea" },
      { rank: "Family",    value: "Protostegidae" },
      { rank: "Genus",     value: "Archelon" },
    ]
  },
  {
    id: 71, name: "Leedsichthys",
    periodName: "Middle Jurassic", periodStart: 165, periodEnd: 155,
    wikiSlug: "Leedsichthys",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Osteichthyes" },
      { rank: "Class",     value: "Actinopterygii" },
      { rank: "Order",     value: "Pachycormiformes" },
      { rank: "Family",    value: "Pachycormidae" },
      { rank: "Genus",     value: "Leedsichthys" },
    ]
  },
  {
    id: 72, name: "Basilosaurus",
    periodName: "Late Eocene", periodStart: 41, periodEnd: 34,
    wikiSlug: "Basilosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Artiodactyla" },
      { rank: "Clade",     value: "Cetancodonta" },
      { rank: "Clade",     value: "Cetacea" },
      { rank: "Clade",     value: "Archaeoceti" },
      { rank: "Family",    value: "Basilosauridae" },
      { rank: "Genus",     value: "Basilosaurus" },
    ]
  },
  {
    id: 73, name: "Livyatan",
    periodName: "Middle Miocene", periodStart: 13, periodEnd: 9,
    wikiSlug: "Livyatan",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Artiodactyla" },
      { rank: "Clade",     value: "Cetancodonta" },
      { rank: "Clade",     value: "Cetacea" },
      { rank: "Suborder",  value: "Odontoceti" },
      { rank: "Superfamily", value: "Physeteroidea" },
      { rank: "Family",    value: "Livyatanidae" },
      { rank: "Genus",     value: "Livyatan" },
    ]
  },
  // ── BATCH 8 ──────────────────────────────────────────────────
  {
    id: 74, name: "Megatherium (Giant Ground Sloth)",
    periodName: "Pliocene–Pleistocene", periodStart: 5.3, periodEnd: 0.01,
    wikiSlug: "Megatherium",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Xenarthra" },
      { rank: "Order",     value: "Pilosa" },
      { rank: "Suborder",  value: "Folivora" },
      { rank: "Family",    value: "Megatheriidae" },
      { rank: "Genus",     value: "Megatherium" },
    ]
  },
  {
    id: 75, name: "Glyptodon (Giant Armadillo)",
    periodName: "Pliocene–Pleistocene", periodStart: 3.2, periodEnd: 0.011,
    wikiSlug: "Glyptodon",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Xenarthra" },
      { rank: "Order",     value: "Cingulata" },
      { rank: "Family",    value: "Chlamyphoridae" },
      { rank: "Subfamily", value: "Glyptodontinae" },
      { rank: "Genus",     value: "Glyptodon" },
    ]
  },
  {
    id: 76, name: "Andrewsarchus",
    periodName: "Middle Eocene", periodStart: 48, periodEnd: 38,
    wikiSlug: "Andrewsarchus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Artiodactyla" },
      { rank: "Clade",     value: "Cetancodontamorpha" },
      { rank: "Family",    value: "Andrewsarchidae" },
      { rank: "Genus",     value: "Andrewsarchus" },
    ]
  },
  {
    id: 77, name: "Paraceratherium (Indricothere)",
    periodName: "Early–Late Oligocene", periodStart: 34, periodEnd: 23,
    wikiSlug: "Paraceratherium",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Perissodactyla" },
      { rank: "Clade",     value: "Ceratomorpha" },
      { rank: "Clade",     value: "Rhinocerotoidea" },
      { rank: "Family",    value: "Hyracodontidae" },
      { rank: "Subfamily", value: "Indricotheriinae" },
      { rank: "Genus",     value: "Paraceratherium" },
    ]
  },
  {
    id: 78, name: "Titanoboa",
    periodName: "Middle–Late Paleocene", periodStart: 60, periodEnd: 58,
    wikiSlug: "Titanoboa",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Diapsida" },
      { rank: "Order",     value: "Squamata" },
      { rank: "Suborder",  value: "Serpentes" },
      { rank: "Family",    value: "Boidae" },
      { rank: "Subfamily", value: "Boinae" },
      { rank: "Genus",     value: "Titanoboa" },
    ]
  },
  {
    id: 79, name: "Carbonemys",
    periodName: "Middle–Late Paleocene", periodStart: 60, periodEnd: 58,
    wikiSlug: "Carbonemys",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Diapsida" },
      { rank: "Order",     value: "Testudines" },
      { rank: "Suborder",  value: "Cryptodira" },
      { rank: "Family",    value: "Podocnemididae" },
      { rank: "Genus",     value: "Carbonemys" },
    ]
  },
  {
    id: 80, name: "Gastornis (Diatryma)",
    periodName: "Paleocene–Eocene", periodStart: 56, periodEnd: 40,
    wikiSlug: "Gastornis",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Neognathae" },
      { rank: "Clade",     value: "Galloanserae" },
      { rank: "Order",     value: "Gastornithiformes" },
      { rank: "Family",    value: "Gastornithidae" },
      { rank: "Genus",     value: "Gastornis" },
    ]
  },
  {
    id: 81, name: "Kelenken",
    periodName: "Middle Miocene", periodStart: 15, periodEnd: 14,
    wikiSlug: "Kelenken",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Neognathae" },
      { rank: "Clade",     value: "Neoaves" },
      { rank: "Clade",     value: "Telluraves" },
      { rank: "Clade",     value: "Australaves" },
      { rank: "Order",     value: "Cariamiformes" },
      { rank: "Family",    value: "Phorusrhacidae" },
      { rank: "Subfamily", value: "Phorusrhacinae" },
      { rank: "Genus",     value: "Kelenken" },
    ]
  },
  {
    id: 82, name: "Megaloceros (Irish Elk)",
    periodName: "Pleistocene–Early Holocene", periodStart: 0.4, periodEnd: 0.0077,
    wikiSlug: "Megaloceros",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Artiodactyla" },
      { rank: "Clade",     value: "Ruminantia" },
      { rank: "Family",    value: "Cervidae" },
      { rank: "Subfamily", value: "Cervinae" },
      { rank: "Tribe",     value: "Megacerini" },
      { rank: "Genus",     value: "Megaloceros" },
    ]
  },
  // ── BATCH 9 ──────────────────────────────────────────────────
  {
    id: 83, name: "Elasmotherium (Siberian Unicorn)",
    periodName: "Late Miocene–Late Pleistocene", periodStart: 5.3, periodEnd: 0.039,
    wikiSlug: "Elasmotherium",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Perissodactyla" },
      { rank: "Clade",     value: "Ceratomorpha" },
      { rank: "Clade",     value: "Rhinocerotoidea" },
      { rank: "Family",    value: "Rhinocerotidae" },
      { rank: "Subfamily", value: "Elasmotheriinae" },
      { rank: "Genus",     value: "Elasmotherium" },
    ]
  },
  {
    id: 84, name: "Dire Wolf",
    periodName: "Late Pleistocene–Early Holocene", periodStart: 0.125, periodEnd: 0.0095,
    wikiSlug: "Dire_wolf",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Carnivora" },
      { rank: "Suborder",  value: "Caniformia" },
      { rank: "Family",    value: "Canidae" },
      { rank: "Subfamily", value: "Aenocyoninae" },
      { rank: "Genus",     value: "Aenocyon" },
    ]
  },
  {
    id: 85, name: "Cave Bear",
    periodName: "Middle–Late Pleistocene", periodStart: 0.25, periodEnd: 0.024,
    wikiSlug: "Cave_bear",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Carnivora" },
      { rank: "Suborder",  value: "Caniformia" },
      { rank: "Family",    value: "Ursidae" },
      { rank: "Subfamily", value: "Ursinae" },
      { rank: "Genus",     value: "Ursus" },
    ]
  },
  {
    id: 86, name: "Gigantopithecus",
    periodName: "Early–Middle Pleistocene", periodStart: 2, periodEnd: 0.3,
    wikiSlug: "Gigantopithecus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Euarchontoglires" },
      { rank: "Order",     value: "Primates" },
      { rank: "Suborder",  value: "Haplorhini" },
      { rank: "Family",    value: "Hominidae" },
      { rank: "Subfamily", value: "Ponginae" },
      { rank: "Genus",     value: "Gigantopithecus" },
    ]
  },
  {
    id: 87, name: "Doedicurus",
    periodName: "Pleistocene–Early Holocene", periodStart: 2.6, periodEnd: 0.008,
    wikiSlug: "Doedicurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Xenarthra" },
      { rank: "Order",     value: "Cingulata" },
      { rank: "Family",    value: "Chlamyphoridae" },
      { rank: "Subfamily", value: "Glyptodontinae" },
      { rank: "Genus",     value: "Doedicurus" },
    ]
  },
  {
    id: 88, name: "Diprotodon (Giant Wombat)",
    periodName: "Pleistocene", periodStart: 1.6, periodEnd: 0.044,
    wikiSlug: "Diprotodon",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Metatheria" },
      { rank: "Order",     value: "Diprotodontia" },
      { rank: "Suborder",  value: "Vombatiformes" },
      { rank: "Family",    value: "Diprotodontidae" },
      { rank: "Genus",     value: "Diprotodon" },
    ]
  },
  {
    id: 89, name: "Thylacoleo (Marsupial Lion)",
    periodName: "Pliocene–Late Pleistocene", periodStart: 5, periodEnd: 0.04,
    wikiSlug: "Thylacoleo",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Metatheria" },
      { rank: "Order",     value: "Diprotodontia" },
      { rank: "Suborder",  value: "Vombatiformes" },
      { rank: "Family",    value: "Thylacoleonidae" },
      { rank: "Genus",     value: "Thylacoleo" },
    ]
  },
  {
    id: 90, name: "Thylacine (Tasmanian Tiger)",
    periodName: "Pleistocene–Holocene", periodStart: 2, periodEnd: 8.8e-05,
    wikiSlug: "Thylacine",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Metatheria" },
      { rank: "Order",     value: "Dasyuromorphia" },
      { rank: "Family",    value: "Thylacinidae" },
      { rank: "Genus",     value: "Thylacinus" },
    ]
  },
  {
    id: 91, name: "Moa",
    periodName: "Pleistocene–Holocene", periodStart: 2.6, periodEnd: 0.0006,
    wikiSlug: "Moa",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Palaeognathae" },
      { rank: "Order",     value: "Dinornithiformes" },
      { rank: "Family",    value: "Dinornithidae" },
      { rank: "Genus",     value: "Dinornis" },
    ]
  },
  {
    id: 92, name: "Haast's Eagle",
    periodName: "Pleistocene–Holocene", periodStart: 1.8, periodEnd: 0.0006,
    wikiSlug: "Haast%27s_eagle",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Neognathae" },
      { rank: "Clade",     value: "Neoaves" },
      { rank: "Clade",     value: "Telluraves" },
      { rank: "Clade",     value: "Afroaves" },
      { rank: "Order",     value: "Accipitriformes" },
      { rank: "Family",    value: "Accipitridae" },
      { rank: "Genus",     value: "Hieraaetus" },
    ]
  },
  {
    id: 93, name: "Dodo",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 0.000319,
    wikiSlug: "Dodo",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Neognathae" },
      { rank: "Clade",     value: "Neoaves" },
      { rank: "Clade",     value: "Columbimorphae" },
      { rank: "Order",     value: "Columbiformes" },
      { rank: "Family",    value: "Columbidae" },
      { rank: "Subfamily", value: "Raphinae" },
      { rank: "Genus",     value: "Raphus" },
    ]
  },
  // ── BATCH 10 ─────────────────────────────────────────────────
  {
    id: 94, name: "Quagga",
    periodName: "Pleistocene–Holocene", periodStart: 0.3, periodEnd: 0.000117,
    wikiSlug: "Quagga",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Perissodactyla" },
      { rank: "Clade",     value: "Hippomorpha" },
      { rank: "Family",    value: "Equidae" },
      { rank: "Genus",     value: "Equus" },
    ]
  },
  {
    id: 95, name: "Aurochs",
    periodName: "Pleistocene–Holocene", periodStart: 2, periodEnd: 0.000383,
    wikiSlug: "Aurochs",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Artiodactyla" },
      { rank: "Clade",     value: "Ruminantia" },
      { rank: "Family",    value: "Bovidae" },
      { rank: "Subfamily", value: "Bovinae" },
      { rank: "Genus",     value: "Bos" },
    ]
  },
  {
    id: 96, name: "Woolly Rhinoceros",
    periodName: "Middle–Late Pleistocene", periodStart: 0.35, periodEnd: 0.01,
    wikiSlug: "Woolly_rhinoceros",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Perissodactyla" },
      { rank: "Clade",     value: "Ceratomorpha" },
      { rank: "Clade",     value: "Rhinocerotoidea" },
      { rank: "Family",    value: "Rhinocerotidae" },
      { rank: "Subfamily", value: "Rhinocerotinae" },
      { rank: "Genus",     value: "Coelodonta" },
    ]
  },
  {
    id: 97, name: "Deinotherium",
    periodName: "Early Miocene–Early Pleistocene", periodStart: 23, periodEnd: 1.5,
    wikiSlug: "Deinotherium",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Afrotheria" },
      { rank: "Order",     value: "Proboscidea" },
      { rank: "Family",    value: "Deinotheriidae" },
      { rank: "Genus",     value: "Deinotherium" },
    ]
  },
  {
    id: 98, name: "Macrauchenia",
    periodName: "Pliocene–Late Pleistocene", periodStart: 7, periodEnd: 0.01,
    wikiSlug: "Macrauchenia",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Atlantogenata" },
      { rank: "Order",     value: "Litopterna" },
      { rank: "Family",    value: "Macraucheniidae" },
      { rank: "Subfamily", value: "Macraucheniinae" },
      { rank: "Genus",     value: "Macrauchenia" },
    ]
  },
  {
    id: 99, name: "Thylacosmilus (Marsupial Saber-tooth)",
    periodName: "Late Miocene–Pliocene", periodStart: 9, periodEnd: 3,
    wikiSlug: "Thylacosmilus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Metatheria" },
      { rank: "Order",     value: "Sparassodonta" },
      { rank: "Family",    value: "Thylacosmilidae" },
      { rank: "Genus",     value: "Thylacosmilus" },
    ]
  },
  {
    id: 100, name: "Megalania",
    periodName: "Pleistocene", periodStart: 1.5, periodEnd: 0.05,
    wikiSlug: "Megalania",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Diapsida" },
      { rank: "Order",     value: "Squamata" },
      { rank: "Suborder",  value: "Lacertilia" },
      { rank: "Family",    value: "Varanidae" },
      { rank: "Genus",     value: "Varanus" },
    ]
  },
  {
    id: 101, name: "Neanderthal (Homo neanderthalensis)",
    periodName: "Middle–Late Pleistocene", periodStart: 0.4, periodEnd: 0.04,
    wikiSlug: "Neanderthal",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Euarchontoglires" },
      { rank: "Order",     value: "Primates" },
      { rank: "Suborder",  value: "Haplorhini" },
      { rank: "Family",    value: "Hominidae" },
      { rank: "Subfamily", value: "Homininae" },
      { rank: "Tribe",     value: "Hominini" },
      { rank: "Genus",     value: "Homo" },
    ]
  },
  // ── BATCH 11 — Personal Favorites ────────────────────────────
  {
    id: 102, name: "Xerces Blue",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 7.8e-05,
    wikiSlug: "Xerces_blue",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Arthropoda" },
      { rank: "Class",     value: "Insecta" },
      { rank: "Clade",     value: "Pterygota" },
      { rank: "Clade",     value: "Holometabola" },
      { rank: "Order",     value: "Lepidoptera" },
      { rank: "Family",    value: "Lycaenidae" },
      { rank: "Subfamily", value: "Polyommatinae" },
      { rank: "Genus",     value: "Glaucopsyche" },
    ]
  },
  {
    id: 103, name: "Passenger Pigeon",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 8.6e-05,
    wikiSlug: "Passenger_pigeon",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Neognathae" },
      { rank: "Clade",     value: "Neoaves" },
      { rank: "Clade",     value: "Columbimorphae" },
      { rank: "Order",     value: "Columbiformes" },
      { rank: "Family",    value: "Columbidae" },
      { rank: "Subfamily", value: "Columbinae" },
      { rank: "Genus",     value: "Ectopistes" },
    ]
  },
  {
    id: 104, name: "Ambulocetus (Walking Whale)",
    periodName: "Early–Middle Eocene", periodStart: 53, periodEnd: 40,
    wikiSlug: "Ambulocetus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Artiodactyla" },
      { rank: "Clade",     value: "Cetancodonta" },
      { rank: "Clade",     value: "Cetacea" },
      { rank: "Clade",     value: "Archaeoceti" },
      { rank: "Family",    value: "Ambulocetidae" },
      { rank: "Genus",     value: "Ambulocetus" },
    ]
  },
  {
    id: 105, name: "Gastonia",
    periodName: "Early Cretaceous", periodStart: 139, periodEnd: 125,
    wikiSlug: "Gastonia_(dinosaur)",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Ornithischia" },
      { rank: "Clade",     value: "Thyreophora" },
      { rank: "Clade",     value: "Ankylosauria" },
      { rank: "Family",    value: "Polacanthidae" },
      { rank: "Genus",     value: "Gastonia" },
    ]
  },
  {
    id: 106, name: "Giant Aye-aye",
    periodName: "Pleistocene–Holocene", periodStart: 0.5, periodEnd: 0.001,
    wikiSlug: "Daubentonia_robusta",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Euarchontoglires" },
      { rank: "Order",     value: "Primates" },
      { rank: "Suborder",  value: "Strepsirrhini" },
      { rank: "Family",    value: "Daubentoniidae" },
      { rank: "Genus",     value: "Daubentonia" },
    ]
  },
  {
    id: 107, name: "Voay",
    periodName: "Late Pleistocene–Holocene", periodStart: 0.126, periodEnd: 0.0007,
    wikiSlug: "Voay",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Pseudosuchia" },
      { rank: "Order",     value: "Crocodilia" },
      { rank: "Family",    value: "Crocodylidae" },
      { rank: "Subfamily", value: "Crocodylinae" },
      { rank: "Genus",     value: "Voay" },
    ]
  },
  {
    id: 108, name: "Simosuchus",
    periodName: "Late Cretaceous", periodStart: 70, periodEnd: 66,
    wikiSlug: "Simosuchus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Pseudosuchia" },
      { rank: "Order",     value: "Crocodilia" },
      { rank: "Clade",     value: "Notosuchia" },
      { rank: "Family",    value: "Simosuchidae" },
      { rank: "Genus",     value: "Simosuchus" },
    ]
  },
  {
    id: 109, name: "Sloth Lemur",
    periodName: "Pleistocene–Holocene", periodStart: 2, periodEnd: 0.001,
    wikiSlug: "Palaeopropithecidae",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Euarchontoglires" },
      { rank: "Order",     value: "Primates" },
      { rank: "Suborder",  value: "Strepsirrhini" },
      { rank: "Family",    value: "Palaeopropithecidae" },
    ]
  },
  // ── BATCH 12 ─────────────────────────────────────────────────
  {
    id: 110, name: "Marrella",
    periodName: "Middle Cambrian", periodStart: 518, periodEnd: 505,
    wikiSlug: "Marrella",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Arthropoda" },
      { rank: "Class",     value: "Marrellomorpha" },
      { rank: "Order",     value: "Marrellida" },
      { rank: "Family",    value: "Marrellidae" },
      { rank: "Genus",     value: "Marrella" },
    ]
  },
  {
    id: 111, name: "Wiwaxia",
    periodName: "Early–Middle Cambrian", periodStart: 520, periodEnd: 505,
    wikiSlug: "Wiwaxia",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Clade",     value: "Lophotrochozoa" },
      { rank: "Clade",     value: "Halwaxiida" },
      { rank: "Genus",     value: "Wiwaxia" },
    ]
  },
  {
    id: 112, name: "Bothriolepis",
    periodName: "Middle–Late Devonian", periodStart: 387, periodEnd: 359,
    wikiSlug: "Bothriolepis",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Class",     value: "Placodermi" },
      { rank: "Order",     value: "Antiarchi" },
      { rank: "Family",    value: "Bothriolepididae" },
      { rank: "Genus",     value: "Bothriolepis" },
    ]
  },
  {
    id: 113, name: "Stethacanthus",
    periodName: "Late Devonian–Early Carboniferous", periodStart: 370, periodEnd: 320,
    wikiSlug: "Stethacanthus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Class",     value: "Chondrichthyes" },
      { rank: "Clade",     value: "Elasmobranchii" },
      { rank: "Order",     value: "Symmoriiformes" },
      { rank: "Family",    value: "Stethacanthidae" },
      { rank: "Genus",     value: "Stethacanthus" },
    ]
  },
  {
    id: 114, name: "Cladoselache",
    periodName: "Late Devonian", periodStart: 370, periodEnd: 360,
    wikiSlug: "Cladoselache",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Class",     value: "Chondrichthyes" },
      { rank: "Order",     value: "Cladoselachiformes" },
      { rank: "Family",    value: "Cladoselachidae" },
      { rank: "Genus",     value: "Cladoselache" },
    ]
  },
  {
    id: 115, name: "Eusthenopteron",
    periodName: "Late Devonian", periodStart: 385, periodEnd: 374,
    wikiSlug: "Eusthenopteron",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Osteichthyes" },
      { rank: "Class",     value: "Sarcopterygii" },
      { rank: "Clade",     value: "Tetrapodomorpha" },
      { rank: "Family",    value: "Tristichopteridae" },
      { rank: "Genus",     value: "Eusthenopteron" },
    ]
  },
  {
    id: 116, name: "Crassigyrinus",
    periodName: "Early Carboniferous", periodStart: 350, periodEnd: 330,
    wikiSlug: "Crassigyrinus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Class",     value: "Amphibia" },
      { rank: "Clade",     value: "Stegocephalia" },
      { rank: "Order",     value: "Palaeostegalia" },
      { rank: "Family",    value: "Crassigyrinidae" },
      { rank: "Genus",     value: "Crassigyrinus" },
    ]
  },
  {
    id: 117, name: "Hylonomus",
    periodName: "Late Carboniferous", periodStart: 315, periodEnd: 312,
    wikiSlug: "Hylonomus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Family",    value: "Protothyrididae" },
      { rank: "Genus",     value: "Hylonomus" },
    ]
  },
  {
    id: 118, name: "Westlothiana",
    periodName: "Early Carboniferous", periodStart: 338, periodEnd: 335,
    wikiSlug: "Westlothiana",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Class",     value: "Amphibia" },
      { rank: "Clade",     value: "Stegocephalia" },
      { rank: "Clade",     value: "Reptiliomorpha" },
      { rank: "Family",    value: "Westlothianidae" },
      { rank: "Genus",     value: "Westlothiana" },
    ]
  },
  {
    id: 119, name: "Prionosuchus",
    periodName: "Early Permian", periodStart: 299, periodEnd: 272,
    wikiSlug: "Prionosuchus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Class",     value: "Amphibia" },
      { rank: "Order",     value: "Temnospondyli" },
      { rank: "Clade",     value: "Stereospondylomorpha" },
      { rank: "Family",    value: "Archegosauridae" },
      { rank: "Genus",     value: "Prionosuchus" },
    ]
  },
  {
    id: 120, name: "Dickinsonia",
    periodName: "Ediacaran", periodStart: 571, periodEnd: 541,
    wikiSlug: "Dickinsonia",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Clade",     value: "Eumetazoa" },
      { rank: "Clade",     value: "Dickinsoniomorpha" },
      { rank: "Genus",     value: "Dickinsonia" },
    ]
  },
  {
    id: 121, name: "Charnia",
    periodName: "Ediacaran", periodStart: 580, periodEnd: 541,
    wikiSlug: "Charnia",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Clade",     value: "Eumetazoa" },
      { rank: "Clade",     value: "Rangeomorpha" },
      { rank: "Family",    value: "Charniidae" },
      { rank: "Genus",     value: "Charnia" },
    ]
  },
  {
    id: 122, name: "Xenacanthus",
    periodName: "Carboniferous–Permian", periodStart: 323, periodEnd: 251,
    wikiSlug: "Xenacanthus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Class",     value: "Chondrichthyes" },
      { rank: "Clade",     value: "Elasmobranchii" },
      { rank: "Order",     value: "Xenacanthiformes" },
      { rank: "Family",    value: "Xenacanthidae" },
      { rank: "Genus",     value: "Xenacanthus" },
    ]
  },
  // ── BATCH 13 ─────────────────────────────────────────────────
  {
    id: 123, name: "Coelophysis",
    periodName: "Late Triassic", periodStart: 216, periodEnd: 203,
    wikiSlug: "Coelophysis",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Theropoda" },
      { rank: "Clade",     value: "Neotheropoda" },
      { rank: "Family",    value: "Coelophysidae" },
      { rank: "Genus",     value: "Coelophysis" },
    ]
  },
  {
    id: 124, name: "Postosuchus",
    periodName: "Late Triassic", periodStart: 228, periodEnd: 202,
    wikiSlug: "Postosuchus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Pseudosuchia" },
      { rank: "Clade",     value: "Loricata" },
      { rank: "Family",    value: "Rauisuchidae" },
      { rank: "Genus",     value: "Postosuchus" },
    ]
  },
  {
    id: 125, name: "Desmatosuchus",
    periodName: "Late Triassic", periodStart: 228, periodEnd: 202,
    wikiSlug: "Desmatosuchus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Pseudosuchia" },
      { rank: "Order",     value: "Aetosauria" },
      { rank: "Family",    value: "Desmatosuchidae" },
      { rank: "Genus",     value: "Desmatosuchus" },
    ]
  },
  {
    id: 126, name: "Shringasaurus",
    periodName: "Middle Triassic", periodStart: 247, periodEnd: 242,
    wikiSlug: "Shringasaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauromorpha" },
      { rank: "Clade",     value: "Allokotosauria" },
      { rank: "Family",    value: "Azendohsauridae" },
      { rank: "Genus",     value: "Shringasaurus" },
    ]
  },
  {
    id: 127, name: "Tanystropheus",
    periodName: "Middle–Late Triassic", periodStart: 247, periodEnd: 201,
    wikiSlug: "Tanystropheus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauromorpha" },
      { rank: "Clade",     value: "Tanysauria" },
      { rank: "Family",    value: "Tanystropheidae" },
      { rank: "Genus",     value: "Tanystropheus" },
    ]
  },
  {
    id: 128, name: "Longisquama",
    periodName: "Middle Triassic", periodStart: 242, periodEnd: 235,
    wikiSlug: "Longisquama",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauromorpha" },
      { rank: "Clade",     value: "Drepanosauromorpha" },
      { rank: "Family",    value: "Longisquamidae" },
      { rank: "Genus",     value: "Longisquama" },
    ]
  },
  {
    id: 129, name: "Herrerasaurus",
    periodName: "Late Triassic", periodStart: 231, periodEnd: 228,
    wikiSlug: "Herrerasaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Herrerasauria" },
      { rank: "Family",    value: "Herrerasauridae" },
      { rank: "Genus",     value: "Herrerasaurus" },
    ]
  },
  {
    id: 130, name: "Plateosaurus",
    periodName: "Late Triassic", periodStart: 214, periodEnd: 204,
    wikiSlug: "Plateosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Sauropodomorpha" },
      { rank: "Clade",     value: "Plateosauria" },
      { rank: "Family",    value: "Plateosauridae" },
      { rank: "Genus",     value: "Plateosaurus" },
    ]
  },
  {
    id: 131, name: "Scelidosaurus",
    periodName: "Early Jurassic", periodStart: 196, periodEnd: 183,
    wikiSlug: "Scelidosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Ornithischia" },
      { rank: "Clade",     value: "Thyreophora" },
      { rank: "Family",    value: "Scelidosauridae" },
      { rank: "Genus",     value: "Scelidosaurus" },
    ]
  },
  {
    id: 132, name: "Cryolophosaurus",
    periodName: "Early Jurassic", periodStart: 196, periodEnd: 188,
    wikiSlug: "Cryolophosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Theropoda" },
      { rank: "Clade",     value: "Neotheropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Family",    value: "Cryolophosauridae" },
      { rank: "Genus",     value: "Cryolophosaurus" },
    ]
  },
  {
    id: 133, name: "Monolophosaurus",
    periodName: "Middle Jurassic", periodStart: 168, periodEnd: 161,
    wikiSlug: "Monolophosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Theropoda" },
      { rank: "Clade",     value: "Neotheropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Family",    value: "Monolophosauridae" },
      { rank: "Genus",     value: "Monolophosaurus" },
    ]
  },
  {
    id: 134, name: "Metriacanthosaurus",
    periodName: "Late Jurassic", periodStart: 162, periodEnd: 155,
    wikiSlug: "Metriacanthosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Avetheropoda" },
      { rank: "Clade",     value: "Carnosauria" },
      { rank: "Clade",     value: "Allosauroidea" },
      { rank: "Family",    value: "Metriacanthosauridae" },
      { rank: "Genus",     value: "Metriacanthosaurus" },
    ]
  },
  {
    id: 135, name: "Miragaia",
    periodName: "Late Jurassic", periodStart: 150, periodEnd: 145,
    wikiSlug: "Miragaia_(dinosaur)",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Ornithischia" },
      { rank: "Clade",     value: "Thyreophora" },
      { rank: "Clade",     value: "Stegosauria" },
      { rank: "Family",    value: "Stegosauridae" },
      { rank: "Subfamily", value: "Dacentrurinae" },
      { rank: "Genus",     value: "Miragaia" },
    ]
  },
  {
    id: 136, name: "Mamenchisaurus",
    periodName: "Late Jurassic", periodStart: 160, periodEnd: 145,
    wikiSlug: "Mamenchisaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Sauropodomorpha" },
      { rank: "Clade",     value: "Sauropoda" },
      { rank: "Clade",     value: "Eusauropoda" },
      { rank: "Family",    value: "Mamenchisauridae" },
      { rank: "Genus",     value: "Mamenchisaurus" },
    ]
  },
  {
    id: 137, name: "Giraffatitan",
    periodName: "Late Jurassic", periodStart: 150, periodEnd: 145,
    wikiSlug: "Giraffatitan",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Sauropodomorpha" },
      { rank: "Clade",     value: "Sauropoda" },
      { rank: "Clade",     value: "Macronaria" },
      { rank: "Clade",     value: "Titanosauriformes" },
      { rank: "Family",    value: "Brachiosauridae" },
      { rank: "Genus",     value: "Giraffatitan" },
    ]
  },
  // ── BATCH 14 ─────────────────────────────────────────────────
  {
    id: 138, name: "Deinocheirus",
    periodName: "Late Cretaceous", periodStart: 71, periodEnd: 69,
    wikiSlug: "Deinocheirus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Ornithomimosauria" },
      { rank: "Family",    value: "Deinocheiridae" },
      { rank: "Genus",     value: "Deinocheirus" },
    ]
  },
  {
    id: 139, name: "Tarbosaurus",
    periodName: "Late Cretaceous", periodStart: 72, periodEnd: 66,
    wikiSlug: "Tarbosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Tyrannosauroidea" },
      { rank: "Family",    value: "Tyrannosauridae" },
      { rank: "Subfamily", value: "Tyrannosaurinae" },
      { rank: "Genus",     value: "Tarbosaurus" },
    ]
  },
  {
    id: 140, name: "Yutyrannus",
    periodName: "Early Cretaceous", periodStart: 125, periodEnd: 120,
    wikiSlug: "Yutyrannus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Tyrannosauroidea" },
      { rank: "Family",    value: "Proceratosauridae" },
      { rank: "Genus",     value: "Yutyrannus" },
    ]
  },
  {
    id: 141, name: "Albertosaurus",
    periodName: "Late Cretaceous", periodStart: 73, periodEnd: 68,
    wikiSlug: "Albertosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Tyrannosauroidea" },
      { rank: "Family",    value: "Tyrannosauridae" },
      { rank: "Subfamily", value: "Albertosaurinae" },
      { rank: "Genus",     value: "Albertosaurus" },
    ]
  },
  {
    id: 142, name: "Concavenator",
    periodName: "Early Cretaceous", periodStart: 130, periodEnd: 125,
    wikiSlug: "Concavenator",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Carnosauria" },
      { rank: "Clade",     value: "Allosauroidea" },
      { rank: "Family",    value: "Carcharodontosauridae" },
      { rank: "Genus",     value: "Concavenator" },
    ]
  },
  {
    id: 143, name: "Saltasaurus",
    periodName: "Late Cretaceous", periodStart: 72, periodEnd: 66,
    wikiSlug: "Saltasaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Sauropodomorpha" },
      { rank: "Clade",     value: "Sauropoda" },
      { rank: "Clade",     value: "Eusauropoda" },
      { rank: "Clade",     value: "Macronaria" },
      { rank: "Clade",     value: "Titanosauriformes" },
      { rank: "Clade",     value: "Titanosauria" },
      { rank: "Family",    value: "Saltasauridae" },
      { rank: "Genus",     value: "Saltasaurus" },
    ]
  },
  {
    id: 144, name: "Nigersaurus",
    periodName: "Early Cretaceous", periodStart: 115, periodEnd: 105,
    wikiSlug: "Nigersaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Sauropodomorpha" },
      { rank: "Clade",     value: "Sauropoda" },
      { rank: "Clade",     value: "Diplodocoidea" },
      { rank: "Family",    value: "Rebbachisauridae" },
      { rank: "Genus",     value: "Nigersaurus" },
    ]
  },
  {
    id: 145, name: "Bajadasaurus",
    periodName: "Early Cretaceous", periodStart: 145, periodEnd: 133,
    wikiSlug: "Bajadasaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Sauropodomorpha" },
      { rank: "Clade",     value: "Sauropoda" },
      { rank: "Clade",     value: "Diplodocoidea" },
      { rank: "Family",    value: "Dicraeosauridae" },
      { rank: "Genus",     value: "Bajadasaurus" },
    ]
  },
  {
    id: 146, name: "Pachyrhinosaurus",
    periodName: "Late Cretaceous", periodStart: 73, periodEnd: 69,
    wikiSlug: "Pachyrhinosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Ornithischia" },
      { rank: "Clade",     value: "Cerapoda" },
      { rank: "Clade",     value: "Marginocephalia" },
      { rank: "Clade",     value: "Ceratopsia" },
      { rank: "Family",    value: "Ceratopsidae" },
      { rank: "Subfamily", value: "Centrosaurinae" },
      { rank: "Genus",     value: "Pachyrhinosaurus" },
    ]
  },
  {
    id: 147, name: "Nasutoceratops",
    periodName: "Late Cretaceous", periodStart: 76, periodEnd: 75,
    wikiSlug: "Nasutoceratops",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Ornithischia" },
      { rank: "Clade",     value: "Cerapoda" },
      { rank: "Clade",     value: "Marginocephalia" },
      { rank: "Clade",     value: "Ceratopsia" },
      { rank: "Family",    value: "Ceratopsidae" },
      { rank: "Subfamily", value: "Centrosaurinae" },
      { rank: "Genus",     value: "Nasutoceratops" },
    ]
  },
  {
    id: 148, name: "Kosmoceratops",
    periodName: "Late Cretaceous", periodStart: 76, periodEnd: 75,
    wikiSlug: "Kosmoceratops",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Ornithischia" },
      { rank: "Clade",     value: "Cerapoda" },
      { rank: "Clade",     value: "Marginocephalia" },
      { rank: "Clade",     value: "Ceratopsia" },
      { rank: "Family",    value: "Ceratopsidae" },
      { rank: "Subfamily", value: "Chasmosaurinae" },
      { rank: "Genus",     value: "Kosmoceratops" },
    ]
  },
  {
    id: 149, name: "Microceratus",
    periodName: "Late Cretaceous", periodStart: 100, periodEnd: 94,
    wikiSlug: "Microceratus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Ornithischia" },
      { rank: "Clade",     value: "Cerapoda" },
      { rank: "Clade",     value: "Marginocephalia" },
      { rank: "Clade",     value: "Ceratopsia" },
      { rank: "Clade",     value: "Neoceratopsia" },
      { rank: "Family",    value: "Archaeoceratopsidae" },
      { rank: "Genus",     value: "Microceratus" },
    ]
  },
  {
    id: 150, name: "Oviraptor",
    periodName: "Late Cretaceous", periodStart: 75, periodEnd: 71,
    wikiSlug: "Oviraptor",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Clade",     value: "Oviraptorosauria" },
      { rank: "Family",    value: "Oviraptoridae" },
      { rank: "Genus",     value: "Oviraptor" },
    ]
  },
  {
    id: 151, name: "Gigantoraptor",
    periodName: "Late Cretaceous", periodStart: 85, periodEnd: 80,
    wikiSlug: "Gigantoraptor",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Clade",     value: "Oviraptorosauria" },
      { rank: "Family",    value: "Caenagnathidae" },
      { rank: "Genus",     value: "Gigantoraptor" },
    ]
  },
  {
    id: 152, name: "Struthiomimus",
    periodName: "Late Cretaceous", periodStart: 76, periodEnd: 66,
    wikiSlug: "Struthiomimus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Ornithomimosauria" },
      { rank: "Family",    value: "Ornithomimidae" },
      { rank: "Genus",     value: "Struthiomimus" },
    ]
  },
  {
    id: 153, name: "Gallimimus",
    periodName: "Late Cretaceous", periodStart: 72, periodEnd: 66,
    wikiSlug: "Gallimimus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Ornithomimosauria" },
      { rank: "Family",    value: "Ornithomimidae" },
      { rank: "Genus",     value: "Gallimimus" },
    ]
  },
  {
    id: 154, name: "Zuul",
    periodName: "Late Cretaceous", periodStart: 76, periodEnd: 75,
    wikiSlug: "Zuul",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Ornithischia" },
      { rank: "Clade",     value: "Thyreophora" },
      { rank: "Clade",     value: "Ankylosauria" },
      { rank: "Family",    value: "Ankylosauridae" },
      { rank: "Subfamily", value: "Ankylosaurinae" },
      { rank: "Genus",     value: "Zuul" },
    ]
  },
  {
    id: 155, name: "Borealopelta",
    periodName: "Early Cretaceous", periodStart: 112, periodEnd: 110,
    wikiSlug: "Borealopelta",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Ornithischia" },
      { rank: "Clade",     value: "Thyreophora" },
      { rank: "Clade",     value: "Ankylosauria" },
      { rank: "Family",    value: "Nodosauridae" },
      { rank: "Genus",     value: "Borealopelta" },
    ]
  },
  {
    id: 156, name: "Hesperornis",
    periodName: "Late Cretaceous", periodStart: 90, periodEnd: 66,
    wikiSlug: "Hesperornis",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Avialae" },
      { rank: "Clade",     value: "Ornithurae" },
      { rank: "Order",     value: "Hesperornithiformes" },
      { rank: "Family",    value: "Hesperornithidae" },
      { rank: "Genus",     value: "Hesperornis" },
    ]
  },
  {
    id: 157, name: "Ichthyornis",
    periodName: "Late Cretaceous", periodStart: 93, periodEnd: 83,
    wikiSlug: "Ichthyornis",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Avialae" },
      { rank: "Clade",     value: "Ornithurae" },
      { rank: "Order",     value: "Ichthyornithiformes" },
      { rank: "Family",    value: "Ichthyornithidae" },
      { rank: "Genus",     value: "Ichthyornis" },
    ]
  },
  // ── BATCH 15 ─────────────────────────────────────────────────
  {
    id: 158, name: "Tupandactylus",
    periodName: "Early Cretaceous", periodStart: 115, periodEnd: 108,
    wikiSlug: "Tupandactylus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Avemetatarsalia" },
      { rank: "Order",     value: "Pterosauria" },
      { rank: "Clade",     value: "Pterodactyloidea" },
      { rank: "Clade",     value: "Azhdarchoidea" },
      { rank: "Family",    value: "Tapejaridae" },
      { rank: "Subfamily", value: "Tapejarinae" },
      { rank: "Genus",     value: "Tupandactylus" },
    ]
  },
  {
    id: 159, name: "Rhamphorhynchus",
    periodName: "Late Jurassic", periodStart: 163, periodEnd: 148,
    wikiSlug: "Rhamphorhynchus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Avemetatarsalia" },
      { rank: "Order",     value: "Pterosauria" },
      { rank: "Clade",     value: "Macronychoptera" },
      { rank: "Clade",     value: "Novialoidea" },
      { rank: "Family",    value: "Rhamphorhynchidae" },
      { rank: "Genus",     value: "Rhamphorhynchus" },
    ]
  },
  {
    id: 160, name: "Dsungaripterus",
    periodName: "Early Cretaceous", periodStart: 133, periodEnd: 120,
    wikiSlug: "Dsungaripterus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Avemetatarsalia" },
      { rank: "Order",     value: "Pterosauria" },
      { rank: "Clade",     value: "Pterodactyloidea" },
      { rank: "Clade",     value: "Dsungaripteroidea" },
      { rank: "Family",    value: "Dsungaripteridae" },
      { rank: "Genus",     value: "Dsungaripterus" },
    ]
  },
  {
    id: 161, name: "Tapejara",
    periodName: "Early Cretaceous", periodStart: 127, periodEnd: 112,
    wikiSlug: "Tapejara_wellnhoferi",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Avemetatarsalia" },
      { rank: "Order",     value: "Pterosauria" },
      { rank: "Clade",     value: "Pterodactyloidea" },
      { rank: "Clade",     value: "Azhdarchoidea" },
      { rank: "Family",    value: "Tapejaridae" },
      { rank: "Subfamily", value: "Tapejarinae" },
      { rank: "Genus",     value: "Tapejara" },
    ]
  },
  {
    id: 162, name: "Nothosaurus",
    periodName: "Middle–Late Triassic", periodStart: 245, periodEnd: 228,
    wikiSlug: "Nothosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Diapsida" },
      { rank: "Clade",     value: "Sauropterygia" },
      { rank: "Order",     value: "Nothosauria" },
      { rank: "Superfamily", value: "Nothosauroidea" },
      { rank: "Family",    value: "Nothosauridae" },
      { rank: "Genus",     value: "Nothosaurus" },
    ]
  },
  {
    id: 163, name: "Cymbospondylus",
    periodName: "Middle Triassic", periodStart: 247, periodEnd: 235,
    wikiSlug: "Cymbospondylus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Diapsida" },
      { rank: "Clade",     value: "Ichthyopterygia" },
      { rank: "Order",     value: "Ichthyosauria" },
      { rank: "Clade",     value: "Merriamosauria" },
      { rank: "Family",    value: "Cymbospondylidae" },
      { rank: "Genus",     value: "Cymbospondylus" },
    ]
  },
  {
    id: 164, name: "Styxosaurus",
    periodName: "Late Cretaceous", periodStart: 85, periodEnd: 80,
    wikiSlug: "Styxosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Diapsida" },
      { rank: "Clade",     value: "Sauropterygia" },
      { rank: "Order",     value: "Plesiosauria" },
      { rank: "Suborder",  value: "Plesiosauroidea" },
      { rank: "Family",    value: "Elasmosauridae" },
      { rank: "Genus",     value: "Styxosaurus" },
    ]
  },
  {
    id: 165, name: "Kronosaurus",
    periodName: "Early Cretaceous", periodStart: 119, periodEnd: 99,
    wikiSlug: "Kronosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Diapsida" },
      { rank: "Clade",     value: "Sauropterygia" },
      { rank: "Order",     value: "Plesiosauria" },
      { rank: "Suborder",  value: "Pliosauroidea" },
      { rank: "Clade",     value: "Thalassophonea" },
      { rank: "Family",    value: "Pliosauridae" },
      { rank: "Genus",     value: "Kronosaurus" },
    ]
  },
  {
    id: 166, name: "Xiphactinus",
    periodName: "Late Cretaceous", periodStart: 100, periodEnd: 66,
    wikiSlug: "Xiphactinus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Osteichthyes" },
      { rank: "Class",     value: "Actinopterygii" },
      { rank: "Clade",     value: "Teleostei" },
      { rank: "Order",     value: "Ichthyodectiformes" },
      { rank: "Family",    value: "Ichthyodectidae" },
      { rank: "Genus",     value: "Xiphactinus" },
    ]
  },
  {
    id: 167, name: "Protostega",
    periodName: "Late Cretaceous", periodStart: 86, periodEnd: 80,
    wikiSlug: "Protostega",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Diapsida" },
      { rank: "Order",     value: "Testudines" },
      { rank: "Suborder",  value: "Cryptodira" },
      { rank: "Superfamily", value: "Chelonioidea" },
      { rank: "Family",    value: "Protostegidae" },
      { rank: "Genus",     value: "Protostega" },
    ]
  },
  {
    id: 168, name: "Dakosaurus",
    periodName: "Late Jurassic–Early Cretaceous", periodStart: 157, periodEnd: 137,
    wikiSlug: "Dakosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Pseudosuchia" },
      { rank: "Order",     value: "Crocodilia" },
      { rank: "Clade",     value: "Thalattosuchia" },
      { rank: "Family",    value: "Metriorhynchidae" },
      { rank: "Genus",     value: "Dakosaurus" },
    ]
  },
  {
    id: 169, name: "Metriorhynchus",
    periodName: "Middle–Late Jurassic", periodStart: 166, periodEnd: 145,
    wikiSlug: "Metriorhynchus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Pseudosuchia" },
      { rank: "Order",     value: "Crocodilia" },
      { rank: "Clade",     value: "Thalattosuchia" },
      { rank: "Family",    value: "Metriorhynchidae" },
      { rank: "Genus",     value: "Metriorhynchus" },
    ]
  },
  {
    id: 170, name: "Sarcosuchus",
    periodName: "Early Cretaceous", periodStart: 133, periodEnd: 100,
    wikiSlug: "Sarcosuchus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Pseudosuchia" },
      { rank: "Order",     value: "Crocodilia" },
      { rank: "Clade",     value: "Neosuchia" },
      { rank: "Family",    value: "Pholidosauridae" },
      { rank: "Genus",     value: "Sarcosuchus" },
    ]
  },
  {
    id: 171, name: "Deinosuchus",
    periodName: "Late Cretaceous", periodStart: 82, periodEnd: 73,
    wikiSlug: "Deinosuchus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Pseudosuchia" },
      { rank: "Order",     value: "Crocodilia" },
      { rank: "Clade",     value: "Eusuchia" },
      { rank: "Clade",     value: "Alligatoroidea" },
      { rank: "Family",    value: "Deinosuchidae" },
      { rank: "Genus",     value: "Deinosuchus" },
    ]
  },
  {
    id: 172, name: "Purussaurus",
    periodName: "Late Miocene", periodStart: 13, periodEnd: 5,
    wikiSlug: "Purussaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Pseudosuchia" },
      { rank: "Order",     value: "Crocodilia" },
      { rank: "Clade",     value: "Eusuchia" },
      { rank: "Family",    value: "Alligatoridae" },
      { rank: "Subfamily", value: "Caimaninae" },
      { rank: "Genus",     value: "Purussaurus" },
    ]
  },
  // ── BATCH 16 ─────────────────────────────────────────────────
  {
    id: 173, name: "Eobasileus",
    periodName: "Middle–Late Eocene", periodStart: 46, periodEnd: 37,
    wikiSlug: "Eobasileus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Dinocerata" },
      { rank: "Family",    value: "Uintatheriidae" },
      { rank: "Subfamily", value: "Uintatheriinae" },
      { rank: "Genus",     value: "Eobasileus" },
    ]
  },
  {
    id: 174, name: "Uintatherium",
    periodName: "Early–Middle Eocene", periodStart: 50, periodEnd: 37,
    wikiSlug: "Uintatherium",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Dinocerata" },
      { rank: "Family",    value: "Uintatheriidae" },
      { rank: "Subfamily", value: "Uintatheriinae" },
      { rank: "Genus",     value: "Uintatherium" },
    ]
  },
  {
    id: 175, name: "Arsinoitherium",
    periodName: "Late Eocene–Early Oligocene", periodStart: 36, periodEnd: 30,
    wikiSlug: "Arsinoitherium",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Afrotheria" },
      { rank: "Clade",     value: "Paenungulata" },
      { rank: "Order",     value: "Embrithopoda" },
      { rank: "Family",    value: "Arsinoitheriidae" },
      { rank: "Genus",     value: "Arsinoitherium" },
    ]
  },
  {
    id: 176, name: "Megacerops",
    periodName: "Late Eocene", periodStart: 38, periodEnd: 33,
    wikiSlug: "Megacerops",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Perissodactyla" },
      { rank: "Clade",     value: "Hippomorpha" },
      { rank: "Family",    value: "Brontotheriidae" },
      { rank: "Subfamily", value: "Brontotheriinae" },
      { rank: "Genus",     value: "Megacerops" },
    ]
  },
  {
    id: 177, name: "Hyaenodon",
    periodName: "Middle Eocene–Early Miocene", periodStart: 42, periodEnd: 17,
    wikiSlug: "Hyaenodon",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Order",     value: "Hyaenodonta" },
      { rank: "Family",    value: "Hyaenodontidae" },
      { rank: "Subfamily", value: "Hyaenodontinae" },
      { rank: "Genus",     value: "Hyaenodon" },
    ]
  },
  {
    id: 178, name: "Sarkastodon",
    periodName: "Middle–Late Eocene", periodStart: 48, periodEnd: 37,
    wikiSlug: "Sarkastodon",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Order",     value: "Oxyaenodonta" },
      { rank: "Family",    value: "Oxyaenidae" },
      { rank: "Subfamily", value: "Oxyaeninae" },
      { rank: "Genus",     value: "Sarkastodon" },
    ]
  },
  {
    id: 179, name: "Amphicyon",
    periodName: "Early–Late Miocene", periodStart: 23, periodEnd: 9,
    wikiSlug: "Amphicyon",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Carnivora" },
      { rank: "Suborder",  value: "Caniformia" },
      { rank: "Family",    value: "Amphicyonidae" },
      { rank: "Subfamily", value: "Amphicyoninae" },
      { rank: "Genus",     value: "Amphicyon" },
    ]
  },
  {
    id: 180, name: "Aepycamelus",
    periodName: "Early–Late Miocene", periodStart: 20, periodEnd: 5,
    wikiSlug: "Aepycamelus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Artiodactyla" },
      { rank: "Clade",     value: "Tylopoda" },
      { rank: "Family",    value: "Camelidae" },
      { rank: "Subfamily", value: "Camelinae" },
      { rank: "Genus",     value: "Aepycamelus" },
    ]
  },
  {
    id: 181, name: "Merychippus",
    periodName: "Middle Miocene", periodStart: 17, periodEnd: 11,
    wikiSlug: "Merychippus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Perissodactyla" },
      { rank: "Clade",     value: "Hippomorpha" },
      { rank: "Family",    value: "Equidae" },
      { rank: "Subfamily", value: "Equinae" },
      { rank: "Genus",     value: "Merychippus" },
    ]
  },
  {
    id: 182, name: "Moeritherium",
    periodName: "Late Eocene–Early Oligocene", periodStart: 37, periodEnd: 29,
    wikiSlug: "Moeritherium",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Afrotheria" },
      { rank: "Order",     value: "Proboscidea" },
      { rank: "Family",    value: "Moeritheriidae" },
      { rank: "Genus",     value: "Moeritherium" },
    ]
  },
  {
    id: 183, name: "Gomphotherium",
    periodName: "Early–Late Miocene", periodStart: 23, periodEnd: 5,
    wikiSlug: "Gomphotherium",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Afrotheria" },
      { rank: "Order",     value: "Proboscidea" },
      { rank: "Clade",     value: "Elephantiformes" },
      { rank: "Family",    value: "Gomphotheriidae" },
      { rank: "Genus",     value: "Gomphotherium" },
    ]
  },
  {
    id: 184, name: "Anancus",
    periodName: "Late Miocene–Early Pleistocene", periodStart: 9, periodEnd: 1.5,
    wikiSlug: "Anancus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Afrotheria" },
      { rank: "Order",     value: "Proboscidea" },
      { rank: "Clade",     value: "Elephantiformes" },
      { rank: "Family",    value: "Gomphotheriidae" },
      { rank: "Genus",     value: "Anancus" },
    ]
  },
  // ── BATCH 17 — Final push to 200 ─────────────────────────────
  {
    id: 185, name: "Sivatherium",
    periodName: "Late Miocene–Early Pleistocene", periodStart: 7, periodEnd: 1,
    wikiSlug: "Sivatherium",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Artiodactyla" },
      { rank: "Clade",     value: "Ruminantia" },
      { rank: "Family",    value: "Giraffidae" },
      { rank: "Subfamily", value: "Sivatheriinae" },
      { rank: "Genus",     value: "Sivatherium" },
    ]
  },
  {
    id: 186, name: "Megalonyx",
    periodName: "Pliocene–Pleistocene", periodStart: 5, periodEnd: 0.011,
    wikiSlug: "Megalonyx",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Xenarthra" },
      { rank: "Order",     value: "Pilosa" },
      { rank: "Suborder",  value: "Folivora" },
      { rank: "Family",    value: "Megalonychidae" },
      { rank: "Genus",     value: "Megalonyx" },
    ]
  },
  {
    id: 187, name: "Thalassocnus",
    periodName: "Late Miocene–Pliocene", periodStart: 8, periodEnd: 3,
    wikiSlug: "Thalassocnus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Xenarthra" },
      { rank: "Order",     value: "Pilosa" },
      { rank: "Suborder",  value: "Folivora" },
      { rank: "Family",    value: "Nothrotheriidae" },
      { rank: "Subfamily", value: "Thalassocninae" },
      { rank: "Genus",     value: "Thalassocnus" },
    ]
  },
  {
    id: 188, name: "Josephoartigasia",
    periodName: "Late Pliocene–Early Pleistocene", periodStart: 4, periodEnd: 2,
    wikiSlug: "Josephoartigasia",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Euarchontoglires" },
      { rank: "Order",     value: "Rodentia" },
      { rank: "Suborder",  value: "Hystricomorpha" },
      { rank: "Family",    value: "Dinomyidae" },
      { rank: "Genus",     value: "Josephoartigasia" },
    ]
  },
  {
    id: 189, name: "Castoroides (Giant Beaver)",
    periodName: "Pleistocene", periodStart: 2.6, periodEnd: 0.01,
    wikiSlug: "Castoroides",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Euarchontoglires" },
      { rank: "Order",     value: "Rodentia" },
      { rank: "Suborder",  value: "Castorimorpha" },
      { rank: "Family",    value: "Castoridae" },
      { rank: "Genus",     value: "Castoroides" },
    ]
  },
  {
    id: 190, name: "Procoptodon (Giant Short-faced Kangaroo)",
    periodName: "Pleistocene", periodStart: 1.6, periodEnd: 0.046,
    wikiSlug: "Procoptodon",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Metatheria" },
      { rank: "Order",     value: "Diprotodontia" },
      { rank: "Family",    value: "Macropodidae" },
      { rank: "Subfamily", value: "Sthenurinae" },
      { rank: "Genus",     value: "Procoptodon" },
    ]
  },
  {
    id: 191, name: "Wonambi",
    periodName: "Pleistocene", periodStart: 1.6, periodEnd: 0.05,
    wikiSlug: "Wonambi",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Diapsida" },
      { rank: "Order",     value: "Squamata" },
      { rank: "Suborder",  value: "Serpentes" },
      { rank: "Family",    value: "Madtsoiidae" },
      { rank: "Genus",     value: "Wonambi" },
    ]
  },
  {
    id: 192, name: "Quinkana",
    periodName: "Late Oligocene–Late Pleistocene", periodStart: 24, periodEnd: 0.04,
    wikiSlug: "Quinkana",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Pseudosuchia" },
      { rank: "Order",     value: "Crocodilia" },
      { rank: "Clade",     value: "Eusuchia" },
      { rank: "Family",    value: "Crocodylidae" },
      { rank: "Subfamily", value: "Mekosuchinae" },
      { rank: "Genus",     value: "Quinkana" },
    ]
  },
  {
    id: 193, name: "Meiolania",
    periodName: "Pleistocene–Holocene", periodStart: 1.8, periodEnd: 0.003,
    wikiSlug: "Meiolania",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Diapsida" },
      { rank: "Order",     value: "Testudines" },
      { rank: "Suborder",  value: "Cryptodira" },
      { rank: "Family",    value: "Meiolaniidae" },
      { rank: "Genus",     value: "Meiolania" },
    ]
  },
  {
    id: 194, name: "Pelagornis",
    periodName: "Oligocene–Early Pleistocene", periodStart: 30, periodEnd: 2.5,
    wikiSlug: "Pelagornis",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Neognathae" },
      { rank: "Clade",     value: "Neoaves" },
      { rank: "Clade",     value: "Aequornithia" },
      { rank: "Order",     value: "Procellariiformes" },
      { rank: "Family",    value: "Pelagornithidae" },
      { rank: "Genus",     value: "Pelagornis" },
    ]
  },
  {
    id: 195, name: "Argentavis (Giant Teratorn)",
    periodName: "Late Miocene", periodStart: 9, periodEnd: 6,
    wikiSlug: "Argentavis",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Neognathae" },
      { rank: "Clade",     value: "Neoaves" },
      { rank: "Clade",     value: "Telluraves" },
      { rank: "Clade",     value: "Afroaves" },
      { rank: "Order",     value: "Cathartiformes" },
      { rank: "Family",    value: "Teratornithidae" },
      { rank: "Genus",     value: "Argentavis" },
    ]
  },
  {
    id: 196, name: "Teratornis",
    periodName: "Pliocene–Late Pleistocene", periodStart: 3.5, periodEnd: 0.01,
    wikiSlug: "Teratornis",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Neognathae" },
      { rank: "Clade",     value: "Neoaves" },
      { rank: "Clade",     value: "Telluraves" },
      { rank: "Clade",     value: "Afroaves" },
      { rank: "Order",     value: "Cathartiformes" },
      { rank: "Family",    value: "Teratornithidae" },
      { rank: "Genus",     value: "Teratornis" },
    ]
  },
  {
    id: 197, name: "Genyornis",
    periodName: "Pleistocene", periodStart: 1.6, periodEnd: 0.05,
    wikiSlug: "Genyornis",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Neognathae" },
      { rank: "Clade",     value: "Galloanserae" },
      { rank: "Order",     value: "Anseriformes" },
      { rank: "Family",    value: "Dromornithidae" },
      { rank: "Genus",     value: "Genyornis" },
    ]
  },
  {
    id: 198, name: "Aepyornis",
    periodName: "Pleistocene–Holocene", periodStart: 2, periodEnd: 0.001,
    wikiSlug: "Aepyornis",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Palaeognathae" },
      { rank: "Order",     value: "Aepyornithiformes" },
      { rank: "Family",    value: "Aepyornithidae" },
      { rank: "Genus",     value: "Aepyornis" },
    ]
  },
  {
    id: 199, name: "Steller's Sea Cow",
    periodName: "Pleistocene–Holocene", periodStart: 0.3, periodEnd: 0.000232,
    wikiSlug: "Steller%27s_sea_cow",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Afrotheria" },
      { rank: "Order",     value: "Sirenia" },
      { rank: "Family",    value: "Dugongidae" },
      { rank: "Genus",     value: "Hydrodamalis" },
    ]
  },
  {
    id: 200, name: "Great Auk",
    periodName: "Middle Pleistocene–Holocene", periodStart: 0.4, periodEnd: 0.000156,
    wikiSlug: "Great_auk",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Neognathae" },
      { rank: "Clade",     value: "Neoaves" },
      { rank: "Clade",     value: "Charadriimorphae" },
      { rank: "Order",     value: "Charadriiformes" },
      { rank: "Family",    value: "Alcidae" },
      { rank: "Genus",     value: "Pinguinus" },
    ]
  },
  {
    id: 201, name: "Cave Lion",
    periodName: "Middle–Late Pleistocene", periodStart: 0.7, periodEnd: 0.013,
    wikiSlug: "Cave_lion",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Carnivora" },
      { rank: "Suborder",  value: "Feliformia" },
      { rank: "Family",    value: "Felidae" },
      { rank: "Subfamily", value: "Pantherinae" },
      { rank: "Genus",     value: "Panthera" },
    ]
  },
  {
    id: 202, name: "Homo floresiensis (Hobbit Human)",
    periodName: "Middle–Late Pleistocene", periodStart: 0.7, periodEnd: 0.05,
    wikiSlug: "Homo_floresiensis",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Euarchontoglires" },
      { rank: "Order",     value: "Primates" },
      { rank: "Suborder",  value: "Haplorhini" },
      { rank: "Family",    value: "Hominidae" },
      { rank: "Subfamily", value: "Homininae" },
      { rank: "Tribe",     value: "Hominini" },
      { rank: "Genus",     value: "Homo" },
    ]
  },
  // ── BATCH 18 ─────────────────────────────────────────────────
  {
    id: 203, name: "Haikouichthys",
    periodName: "Early Cambrian", periodStart: 521, periodEnd: 514,
    wikiSlug: "Haikouichthys",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Order",     value: "Myllokunmingiida" },
      { rank: "Family",    value: "Myllokunmingiidae" },
      { rank: "Genus",     value: "Haikouichthys" },
    ]
  },
  {
    id: 204, name: "Cephalaspis",
    periodName: "Early Devonian", periodStart: 419, periodEnd: 393,
    wikiSlug: "Cephalaspis",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Class",     value: "Osteostraci" },
      { rank: "Order",     value: "Cephalaspidiformes" },
      { rank: "Family",    value: "Cephalaspididae" },
      { rank: "Genus",     value: "Cephalaspis" },
    ]
  },
  {
    id: 205, name: "Brontoscorpio",
    periodName: "Early Devonian", periodStart: 419, periodEnd: 416,
    wikiSlug: "Brontoscorpio",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Arthropoda" },
      { rank: "Subphylum", value: "Chelicerata" },
      { rank: "Class",     value: "Arachnida" },
      { rank: "Order",     value: "Scorpiones" },
      { rank: "Family",    value: "Eoscorpiidae" },
      { rank: "Genus",     value: "Brontoscorpio" },
    ]
  },
  {
    id: 206, name: "Hynerpeton",
    periodName: "Late Devonian", periodStart: 365, periodEnd: 359,
    wikiSlug: "Hynerpeton",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Class",     value: "Amphibia" },
      { rank: "Clade",     value: "Stegocephalia" },
      { rank: "Family",    value: "Hynerpetidae" },
      { rank: "Genus",     value: "Hynerpeton" },
    ]
  },
  {
    id: 207, name: "Hyneria",
    periodName: "Late Devonian", periodStart: 370, periodEnd: 360,
    wikiSlug: "Hyneria",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Osteichthyes" },
      { rank: "Class",     value: "Sarcopterygii" },
      { rank: "Clade",     value: "Tetrapodomorpha" },
      { rank: "Family",    value: "Tristichopteridae" },
      { rank: "Genus",     value: "Hyneria" },
    ]
  },
  {
    id: 208, name: "Petrolacosaurus",
    periodName: "Late Carboniferous", periodStart: 302, periodEnd: 299,
    wikiSlug: "Petrolacosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Diapsida" },
      { rank: "Clade",     value: "Neodiapsida" },
      { rank: "Family",    value: "Petrolacosauridae" },
      { rank: "Genus",     value: "Petrolacosaurus" },
    ]
  },
  {
    id: 209, name: "Proterogyrinus",
    periodName: "Early Carboniferous", periodStart: 331, periodEnd: 323,
    wikiSlug: "Proterogyrinus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Class",     value: "Amphibia" },
      { rank: "Clade",     value: "Stegocephalia" },
      { rank: "Clade",     value: "Reptiliomorpha" },
      { rank: "Order",     value: "Embolomeri" },
      { rank: "Family",    value: "Proterogyriniidae" },
      { rank: "Genus",     value: "Proterogyrinus" },
    ]
  },
  {
    id: 210, name: "Diictodon",
    periodName: "Late Permian", periodStart: 265, periodEnd: 252,
    wikiSlug: "Diictodon",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Order",     value: "Therapsida" },
      { rank: "Clade",     value: "Anomodontia" },
      { rank: "Clade",     value: "Dicynodontia" },
      { rank: "Family",    value: "Dicynodontidae" },
      { rank: "Genus",     value: "Diictodon" },
    ]
  },
  {
    id: 211, name: "Gorgonops",
    periodName: "Late Permian", periodStart: 260, periodEnd: 252,
    wikiSlug: "Gorgonops",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Order",     value: "Therapsida" },
      { rank: "Clade",     value: "Theriodontia" },
      { rank: "Suborder",  value: "Gorgonopsia" },
      { rank: "Family",    value: "Gorgonopsidae" },
      { rank: "Genus",     value: "Gorgonops" },
    ]
  },
  {
    id: 212, name: "Lystrosaurus",
    periodName: "Late Permian–Early Triassic", periodStart: 255, periodEnd: 247,
    wikiSlug: "Lystrosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Order",     value: "Therapsida" },
      { rank: "Clade",     value: "Anomodontia" },
      { rank: "Clade",     value: "Dicynodontia" },
      { rank: "Family",    value: "Lystrosauridae" },
      { rank: "Genus",     value: "Lystrosaurus" },
    ]
  },
  {
    id: 213, name: "Euparkeria",
    periodName: "Early–Middle Triassic", periodStart: 247, periodEnd: 242,
    wikiSlug: "Euparkeria",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauriformes" },
      { rank: "Family",    value: "Euparkeriidae" },
      { rank: "Genus",     value: "Euparkeria" },
    ]
  },
  {
    id: 214, name: "Proterosuchus",
    periodName: "Early Triassic", periodStart: 252, periodEnd: 247,
    wikiSlug: "Proterosuchus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauriformes" },
      { rank: "Family",    value: "Proterosuchidae" },
      { rank: "Genus",     value: "Proterosuchus" },
    ]
  },
  {
    id: 215, name: "Euchambersia",
    periodName: "Late Permian", periodStart: 260, periodEnd: 252,
    wikiSlug: "Euchambersia",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Order",     value: "Therapsida" },
      { rank: "Suborder",  value: "Therocephalia" },
      { rank: "Family",    value: "Euchambersiidae" },
      { rank: "Genus",     value: "Euchambersia" },
    ]
  },
  // ── BATCH 19 ─────────────────────────────────────────────────
  {
    id: 216, name: "Placerias",
    periodName: "Late Triassic", periodStart: 221, periodEnd: 210,
    wikiSlug: "Placerias",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Order",     value: "Therapsida" },
      { rank: "Clade",     value: "Anomodontia" },
      { rank: "Clade",     value: "Dicynodontia" },
      { rank: "Family",    value: "Placeridae" },
      { rank: "Genus",     value: "Placerias" },
    ]
  },
  {
    id: 217, name: "Thrinaxodon",
    periodName: "Early Triassic", periodStart: 252, periodEnd: 247,
    wikiSlug: "Thrinaxodon",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Order",     value: "Therapsida" },
      { rank: "Suborder",  value: "Cynodontia" },
      { rank: "Family",    value: "Thrinaxodontidae" },
      { rank: "Genus",     value: "Thrinaxodon" },
    ]
  },
  {
    id: 218, name: "Peteinosaurus",
    periodName: "Late Triassic", periodStart: 228, periodEnd: 210,
    wikiSlug: "Peteinosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Avemetatarsalia" },
      { rank: "Order",     value: "Pterosauria" },
      { rank: "Clade",     value: "Macronychoptera" },
      { rank: "Family",    value: "Eudimorphodontidae" },
      { rank: "Genus",     value: "Peteinosaurus" },
    ]
  },
  {
    id: 219, name: "Ornitholestes",
    periodName: "Late Jurassic", periodStart: 154, periodEnd: 148,
    wikiSlug: "Ornitholestes",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Family",    value: "Ornitholestidae" },
      { rank: "Genus",     value: "Ornitholestes" },
    ]
  },
  {
    id: 220, name: "Anurognathus",
    periodName: "Late Jurassic", periodStart: 152, periodEnd: 145,
    wikiSlug: "Anurognathus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Avemetatarsalia" },
      { rank: "Order",     value: "Pterosauria" },
      { rank: "Clade",     value: "Macronychoptera" },
      { rank: "Family",    value: "Anurognathidae" },
      { rank: "Genus",     value: "Anurognathus" },
    ]
  },
  {
    id: 221, name: "Cryptoclidus",
    periodName: "Middle Jurassic", periodStart: 165, periodEnd: 155,
    wikiSlug: "Cryptoclidus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Diapsida" },
      { rank: "Clade",     value: "Sauropterygia" },
      { rank: "Order",     value: "Plesiosauria" },
      { rank: "Suborder",  value: "Plesiosauroidea" },
      { rank: "Clade",     value: "Cryptoclidia" },
      { rank: "Family",    value: "Cryptoclididae" },
      { rank: "Genus",     value: "Cryptoclidus" },
    ]
  },
  {
    id: 222, name: "Ophthalmosaurus",
    periodName: "Middle–Late Jurassic", periodStart: 165, periodEnd: 150,
    wikiSlug: "Ophthalmosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Diapsida" },
      { rank: "Clade",     value: "Ichthyopterygia" },
      { rank: "Order",     value: "Ichthyosauria" },
      { rank: "Clade",     value: "Merriamosauria" },
      { rank: "Clade",     value: "Parvipelvia" },
      { rank: "Family",    value: "Ophthalmosauridae" },
      { rank: "Genus",     value: "Ophthalmosaurus" },
    ]
  },
  {
    id: 223, name: "Eustreptospondylus",
    periodName: "Middle Jurassic", periodStart: 166, periodEnd: 161,
    wikiSlug: "Eustreptospondylus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Megalosauroidea" },
      { rank: "Family",    value: "Eustreptospondylidae" },
      { rank: "Genus",     value: "Eustreptospondylus" },
    ]
  },
  {
    id: 224, name: "Hybodus",
    periodName: "Late Triassic–Late Cretaceous", periodStart: 225, periodEnd: 66,
    wikiSlug: "Hybodus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Class",     value: "Chondrichthyes" },
      { rank: "Clade",     value: "Elasmobranchii" },
      { rank: "Order",     value: "Hybodontiformes" },
      { rank: "Family",    value: "Hybodontidae" },
      { rank: "Genus",     value: "Hybodus" },
    ]
  },
  {
    id: 225, name: "Tropeognathus",
    periodName: "Early Cretaceous", periodStart: 115, periodEnd: 110,
    wikiSlug: "Tropeognathus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Avemetatarsalia" },
      { rank: "Order",     value: "Pterosauria" },
      { rank: "Clade",     value: "Pterodactyloidea" },
      { rank: "Clade",     value: "Ornithocheiromorpha" },
      { rank: "Family",    value: "Anhangueridae" },
      { rank: "Genus",     value: "Tropeognathus" },
    ]
  },
  {
    id: 226, name: "Iberomesornis",
    periodName: "Early Cretaceous", periodStart: 130, periodEnd: 120,
    wikiSlug: "Iberomesornis",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Avialae" },
      { rank: "Clade",     value: "Enantiornithes" },
      { rank: "Family",    value: "Iberomesornithidae" },
      { rank: "Genus",     value: "Iberomesornis" },
    ]
  },
  {
    id: 227, name: "Leaellynasaura",
    periodName: "Early Cretaceous", periodStart: 113, periodEnd: 100,
    wikiSlug: "Leaellynasaura",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Ornithischia" },
      { rank: "Clade",     value: "Cerapoda" },
      { rank: "Clade",     value: "Ornithopoda" },
      { rank: "Family",    value: "Leaellynasauridae" },
      { rank: "Genus",     value: "Leaellynasaura" },
    ]
  },
  {
    id: 228, name: "Muttaburrasaurus",
    periodName: "Early Cretaceous", periodStart: 113, periodEnd: 99,
    wikiSlug: "Muttaburrasaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Ornithischia" },
      { rank: "Clade",     value: "Cerapoda" },
      { rank: "Clade",     value: "Ornithopoda" },
      { rank: "Clade",     value: "Iguanodontia" },
      { rank: "Family",    value: "Muttaburrasauridae" },
      { rank: "Genus",     value: "Muttaburrasaurus" },
    ]
  },
  {
    id: 229, name: "Koolasuchus",
    periodName: "Early Cretaceous", periodStart: 125, periodEnd: 112,
    wikiSlug: "Koolasuchus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Class",     value: "Amphibia" },
      { rank: "Order",     value: "Temnospondyli" },
      { rank: "Clade",     value: "Stereospondylomorpha" },
      { rank: "Clade",     value: "Stereospondyli" },
      { rank: "Family",    value: "Chigutisauridae" },
      { rank: "Genus",     value: "Koolasuchus" },
    ]
  },
  {
    id: 230, name: "Australovenator",
    periodName: "Late Cretaceous", periodStart: 95, periodEnd: 91,
    wikiSlug: "Australovenator",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Megaraptora" },
      { rank: "Family",    value: "Megaraptoridae" },
      { rank: "Genus",     value: "Australovenator" },
    ]
  },
  {
    id: 231, name: "Torosaurus",
    periodName: "Late Cretaceous", periodStart: 68, periodEnd: 66,
    wikiSlug: "Torosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Ornithischia" },
      { rank: "Clade",     value: "Cerapoda" },
      { rank: "Clade",     value: "Marginocephalia" },
      { rank: "Clade",     value: "Ceratopsia" },
      { rank: "Family",    value: "Ceratopsidae" },
      { rank: "Subfamily", value: "Chasmosaurinae" },
      { rank: "Genus",     value: "Torosaurus" },
    ]
  },
  {
    id: 232, name: "Didelphodon",
    periodName: "Late Cretaceous", periodStart: 70, periodEnd: 66,
    wikiSlug: "Didelphodon",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Metatheria" },
      { rank: "Order",     value: "Marsupialiformes" },
      { rank: "Family",    value: "Stagodontidae" },
      { rank: "Genus",     value: "Didelphodon" },
    ]
  },
  {
    id: 233, name: "Mononykus",
    periodName: "Late Cretaceous", periodStart: 70, periodEnd: 66,
    wikiSlug: "Mononykus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Clade",     value: "Alvarezsauria" },
      { rank: "Family",    value: "Alvarezsauridae" },
      { rank: "Genus",     value: "Mononykus" },
    ]
  },
  {
    id: 234, name: "Saurolophus",
    periodName: "Late Cretaceous", periodStart: 70, periodEnd: 66,
    wikiSlug: "Saurolophus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Ornithischia" },
      { rank: "Clade",     value: "Cerapoda" },
      { rank: "Clade",     value: "Ornithopoda" },
      { rank: "Family",    value: "Hadrosauridae" },
      { rank: "Subfamily", value: "Saurolophinae" },
      { rank: "Genus",     value: "Saurolophus" },
    ]
  },
  {
    id: 235, name: "Macrogryphosaurus",
    periodName: "Late Cretaceous", periodStart: 90, periodEnd: 85,
    wikiSlug: "Macrogryphosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Ornithischia" },
      { rank: "Clade",     value: "Cerapoda" },
      { rank: "Clade",     value: "Ornithopoda" },
      { rank: "Clade",     value: "Iguanodontia" },
      { rank: "Family",    value: "Macrogryphosauridae" },
      { rank: "Genus",     value: "Macrogryphosaurus" },
    ]
  },
  {
    id: 236, name: "Polacanthus",
    periodName: "Early Cretaceous", periodStart: 132, periodEnd: 112,
    wikiSlug: "Polacanthus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Ornithischia" },
      { rank: "Clade",     value: "Thyreophora" },
      { rank: "Clade",     value: "Ankylosauria" },
      { rank: "Family",    value: "Polacanthidae" },
      { rank: "Genus",     value: "Polacanthus" },
    ]
  },
  // ── BATCH 20 ─────────────────────────────────────────────────
  {
    id: 237, name: "Megalograptus",
    periodName: "Late Ordovician", periodStart: 460, periodEnd: 443,
    wikiSlug: "Megalograptus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Arthropoda" },
      { rank: "Subphylum", value: "Chelicerata" },
      { rank: "Class",     value: "Merostomata" },
      { rank: "Order",     value: "Eurypterida" },
      { rank: "Superfamily", value: "Carcinosomatoidea" },
      { rank: "Family",    value: "Megalograptidae" },
      { rank: "Genus",     value: "Megalograptus" },
    ]
  },
  {
    id: 238, name: "Astraspis",
    periodName: "Middle Ordovician", periodStart: 470, periodEnd: 458,
    wikiSlug: "Astraspis",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Class",     value: "Astraspida" },
      { rank: "Family",    value: "Astraspididae" },
      { rank: "Genus",     value: "Astraspis" },
    ]
  },
  {
    id: 239, name: "Isotelus",
    periodName: "Late Ordovician", periodStart: 460, periodEnd: 443,
    wikiSlug: "Isotelus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Arthropoda" },
      { rank: "Class",     value: "Trilobita" },
      { rank: "Order",     value: "Asaphida" },
      { rank: "Family",    value: "Asaphidae" },
      { rank: "Genus",     value: "Isotelus" },
    ]
  },
  {
    id: 240, name: "Tylosaurus",
    periodName: "Late Cretaceous", periodStart: 92, periodEnd: 66,
    wikiSlug: "Tylosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Diapsida" },
      { rank: "Order",     value: "Squamata" },
      { rank: "Suborder",  value: "Mosasauria" },
      { rank: "Family",    value: "Mosasauridae" },
      { rank: "Subfamily", value: "Tylosaurinae" },
      { rank: "Genus",     value: "Tylosaurus" },
    ]
  },
  {
    id: 241, name: "Odobenocetops",
    periodName: "Late Miocene–Early Pliocene", periodStart: 8, periodEnd: 3,
    wikiSlug: "Odobenocetops",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Artiodactyla" },
      { rank: "Clade",     value: "Cetancodonta" },
      { rank: "Clade",     value: "Cetacea" },
      { rank: "Suborder",  value: "Odontoceti" },
      { rank: "Superfamily", value: "Delphinoidea" },
      { rank: "Family",    value: "Odobenocetopsidae" },
      { rank: "Genus",     value: "Odobenocetops" },
    ]
  },
  {
    id: 242, name: "Cetotherium",
    periodName: "Late Miocene", periodStart: 11, periodEnd: 7,
    wikiSlug: "Cetotherium",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Artiodactyla" },
      { rank: "Clade",     value: "Cetancodonta" },
      { rank: "Clade",     value: "Cetacea" },
      { rank: "Suborder",  value: "Mysticeti" },
      { rank: "Family",    value: "Cetotheriidae" },
      { rank: "Genus",     value: "Cetotherium" },
    ]
  },
  // ── BATCH 21 ─────────────────────────────────────────────────
  {
    id: 243, name: "Leptictidium",
    periodName: "Middle Eocene", periodStart: 48, periodEnd: 40,
    wikiSlug: "Leptictidium",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Order",     value: "Leptictida" },
      { rank: "Family",    value: "Leptictididae" },
      { rank: "Genus",     value: "Leptictidium" },
    ]
  },
  {
    id: 244, name: "Godinotia",
    periodName: "Middle Eocene", periodStart: 47, periodEnd: 40,
    wikiSlug: "Godinotia",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Euarchontoglires" },
      { rank: "Order",     value: "Primates" },
      { rank: "Suborder",  value: "Haplorhini" },
      { rank: "Family",    value: "Omomyidae" },
      { rank: "Genus",     value: "Godinotia" },
    ]
  },
  {
    id: 245, name: "Propalaeotherium",
    periodName: "Middle Eocene", periodStart: 48, periodEnd: 38,
    wikiSlug: "Propalaeotherium",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Perissodactyla" },
      { rank: "Clade",     value: "Hippomorpha" },
      { rank: "Family",    value: "Palaeotheriidae" },
      { rank: "Genus",     value: "Propalaeotherium" },
    ]
  },
  {
    id: 246, name: "Titanomyrma",
    periodName: "Middle Eocene", periodStart: 49, periodEnd: 44,
    wikiSlug: "Titanomyrma",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Arthropoda" },
      { rank: "Class",     value: "Insecta" },
      { rank: "Clade",     value: "Pterygota" },
      { rank: "Clade",     value: "Holometabola" },
      { rank: "Order",     value: "Hymenoptera" },
      { rank: "Family",    value: "Formicidae" },
      { rank: "Subfamily", value: "Formiciinae" },
      { rank: "Genus",     value: "Titanomyrma" },
    ]
  },
  {
    id: 247, name: "Embolotherium",
    periodName: "Late Eocene", periodStart: 37, periodEnd: 34,
    wikiSlug: "Embolotherium",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Perissodactyla" },
      { rank: "Clade",     value: "Hippomorpha" },
      { rank: "Family",    value: "Brontotheriidae" },
      { rank: "Subfamily", value: "Brontotheriinae" },
      { rank: "Genus",     value: "Embolotherium" },
    ]
  },
  {
    id: 248, name: "Apidium",
    periodName: "Late Eocene–Early Oligocene", periodStart: 37, periodEnd: 30,
    wikiSlug: "Apidium",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Euarchontoglires" },
      { rank: "Order",     value: "Primates" },
      { rank: "Suborder",  value: "Haplorhini" },
      { rank: "Parvorder", value: "Catarrhini" },
      { rank: "Family",    value: "Parapithecidae" },
      { rank: "Genus",     value: "Apidium" },
    ]
  },
  {
    id: 249, name: "Cynodictis",
    periodName: "Late Eocene–Early Oligocene", periodStart: 37, periodEnd: 28,
    wikiSlug: "Cynodictis",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Carnivora" },
      { rank: "Suborder",  value: "Caniformia" },
      { rank: "Family",    value: "Amphicyonidae" },
      { rank: "Genus",     value: "Cynodictis" },
    ]
  },
  {
    id: 250, name: "Chalicotherium",
    periodName: "Late Oligocene–Late Miocene", periodStart: 28, periodEnd: 8,
    wikiSlug: "Chalicotherium",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Perissodactyla" },
      { rank: "Clade",     value: "Ancylopodia" },
      { rank: "Family",    value: "Chalicotheriidae" },
      { rank: "Subfamily", value: "Chalicotheriinae" },
      { rank: "Genus",     value: "Chalicotherium" },
    ]
  },
  {
    id: 251, name: "Ancylotherium",
    periodName: "Late Miocene–Early Pliocene", periodStart: 9, periodEnd: 4,
    wikiSlug: "Ancylotherium",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Perissodactyla" },
      { rank: "Clade",     value: "Ancylopodia" },
      { rank: "Family",    value: "Chalicotheriidae" },
      { rank: "Subfamily", value: "Schizotheriinae" },
      { rank: "Genus",     value: "Ancylotherium" },
    ]
  },
  {
    id: 252, name: "Australopithecus",
    periodName: "Late Pliocene–Early Pleistocene", periodStart: 3.9, periodEnd: 2.9,
    wikiSlug: "Australopithecus_afarensis",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Euarchontoglires" },
      { rank: "Order",     value: "Primates" },
      { rank: "Suborder",  value: "Haplorhini" },
      { rank: "Family",    value: "Hominidae" },
      { rank: "Subfamily", value: "Homininae" },
      { rank: "Tribe",     value: "Hominini" },
      { rank: "Genus",     value: "Australopithecus" },
    ]
  },
  {
    id: 253, name: "Dinofelis",
    periodName: "Late Miocene–Early Pleistocene", periodStart: 5, periodEnd: 1.2,
    wikiSlug: "Dinofelis",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Carnivora" },
      { rank: "Suborder",  value: "Feliformia" },
      { rank: "Family",    value: "Felidae" },
      { rank: "Subfamily", value: "Machairodontinae" },
      { rank: "Genus",     value: "Dinofelis" },
    ]
  },
  {
    id: 254, name: "Phorusrhacos",
    periodName: "Middle Miocene", periodStart: 20, periodEnd: 13,
    wikiSlug: "Phorusrhacos",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Neognathae" },
      { rank: "Clade",     value: "Neoaves" },
      { rank: "Clade",     value: "Telluraves" },
      { rank: "Clade",     value: "Australaves" },
      { rank: "Order",     value: "Cariamiformes" },
      { rank: "Family",    value: "Phorusrhacidae" },
      { rank: "Subfamily", value: "Phorusrhacinae" },
      { rank: "Genus",     value: "Phorusrhacos" },
    ]
  },
  {
    id: 255, name: "Homo erectus",
    periodName: "Early–Late Pleistocene", periodStart: 1.9, periodEnd: 0.11,
    wikiSlug: "Homo_erectus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Euarchontoglires" },
      { rank: "Order",     value: "Primates" },
      { rank: "Suborder",  value: "Haplorhini" },
      { rank: "Family",    value: "Hominidae" },
      { rank: "Subfamily", value: "Homininae" },
      { rank: "Tribe",     value: "Hominini" },
      { rank: "Genus",     value: "Homo" },
    ]
  },
  // ── BATCH 22 ─────────────────────────────────────────────────
  {
    id: 256, name: "Ulemosaurus",
    periodName: "Middle Permian", periodStart: 265, periodEnd: 260,
    wikiSlug: "Ulemosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Order",     value: "Therapsida" },
      { rank: "Suborder",  value: "Dinocephalia" },
      { rank: "Family",    value: "Tapinocephalidae" },
      { rank: "Genus",     value: "Ulemosaurus" },
    ]
  },
  {
    id: 257, name: "Moschops",
    periodName: "Middle Permian", periodStart: 265, periodEnd: 260,
    wikiSlug: "Moschops",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Order",     value: "Therapsida" },
      { rank: "Suborder",  value: "Dinocephalia" },
      { rank: "Family",    value: "Tapinocephalidae" },
      { rank: "Genus",     value: "Moschops" },
    ]
  },
  {
    id: 258, name: "Pareiasaurus",
    periodName: "Middle–Late Permian", periodStart: 265, periodEnd: 252,
    wikiSlug: "Pareiasaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Parareptilia" },
      { rank: "Order",     value: "Procolophonomorpha" },
      { rank: "Clade",     value: "Pareiasauria" },
      { rank: "Family",    value: "Pareiasauridae" },
      { rank: "Genus",     value: "Pareiasaurus" },
    ]
  },
  {
    id: 259, name: "Rhinesuchus",
    periodName: "Middle–Late Permian", periodStart: 265, periodEnd: 252,
    wikiSlug: "Rhinesuchus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Class",     value: "Amphibia" },
      { rank: "Order",     value: "Temnospondyli" },
      { rank: "Clade",     value: "Stereospondylomorpha" },
      { rank: "Family",    value: "Rhinesuchidae" },
      { rank: "Genus",     value: "Rhinesuchus" },
    ]
  },
  {
    id: 260, name: "Hesperosuchus",
    periodName: "Late Triassic", periodStart: 225, periodEnd: 215,
    wikiSlug: "Hesperosuchus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Pseudosuchia" },
      { rank: "Clade",     value: "Crocodylomorpha" },
      { rank: "Family",    value: "Hesperosuchiidae" },
      { rank: "Genus",     value: "Hesperosuchus" },
    ]
  },
  {
    id: 261, name: "Saurosuchus",
    periodName: "Late Triassic", periodStart: 231, periodEnd: 221,
    wikiSlug: "Saurosuchus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Pseudosuchia" },
      { rank: "Clade",     value: "Loricata" },
      { rank: "Family",    value: "Prestosuchidae" },
      { rank: "Genus",     value: "Saurosuchus" },
    ]
  },
  {
    id: 262, name: "Aetosaurus",
    periodName: "Late Triassic", periodStart: 228, periodEnd: 201,
    wikiSlug: "Aetosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Pseudosuchia" },
      { rank: "Order",     value: "Aetosauria" },
      { rank: "Family",    value: "Stagonolepididae" },
      { rank: "Subfamily", value: "Aetosaurinae" },
      { rank: "Genus",     value: "Aetosaurus" },
    ]
  },
  // ── BATCH 23 — Madagascar's Lost World ───────────────────────

  {
    id: 264, name: "Megaladapis",
    periodName: "Pleistocene–Holocene", periodStart: 2, periodEnd: 0.0005,
    wikiSlug: "Megaladapis",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Euarchontoglires" },
      { rank: "Order",     value: "Primates" },
      { rank: "Suborder",  value: "Strepsirrhini" },
      { rank: "Infraorder", value: "Lemuriformes" },
      { rank: "Family",    value: "Megaladapidae" },
      { rank: "Genus",     value: "Megaladapis" },
    ]
  },


  {
    id: 267, name: "Archaeolemur",
    periodName: "Pleistocene–Holocene", periodStart: 2, periodEnd: 0.001,
    wikiSlug: "Archaeolemur",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Euarchontoglires" },
      { rank: "Order",     value: "Primates" },
      { rank: "Suborder",  value: "Strepsirrhini" },
      { rank: "Infraorder", value: "Lemuriformes" },
      { rank: "Family",    value: "Archaeolemuridae" },
      { rank: "Genus",     value: "Archaeolemur" },
    ]
  },
  {
    id: 268, name: "Hadropithecus",
    periodName: "Pleistocene–Holocene", periodStart: 2, periodEnd: 0.001,
    wikiSlug: "Hadropithecus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Euarchontoglires" },
      { rank: "Order",     value: "Primates" },
      { rank: "Suborder",  value: "Strepsirrhini" },
      { rank: "Infraorder", value: "Lemuriformes" },
      { rank: "Family",    value: "Archaeolemuridae" },
      { rank: "Genus",     value: "Hadropithecus" },
    ]
  },
  {
    id: 269, name: "Cryptoprocta spelea",
    periodName: "Holocene", periodStart: 0.1, periodEnd: 0.0005,
    wikiSlug: "Cryptoprocta_spelea",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Carnivora" },
      { rank: "Suborder",  value: "Feliformia" },
      { rank: "Family",    value: "Eupleridae" },
      { rank: "Subfamily", value: "Euplerinae" },
      { rank: "Genus",     value: "Cryptoprocta" },
    ]
  },
  {
    id: 270, name: "Mullerornis",
    periodName: "Pleistocene–Holocene", periodStart: 2, periodEnd: 0.001,
    wikiSlug: "Mullerornis",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Palaeognathae" },
      { rank: "Order",     value: "Aepyornithiformes" },
      { rank: "Family",    value: "Aepyornithidae" },
      { rank: "Genus",     value: "Mullerornis" },
    ]
  },
  {
    id: 271, name: "Hippopotamus lemerlei",
    periodName: "Pleistocene–Holocene", periodStart: 2, periodEnd: 0.001,
    wikiSlug: "Hippopotamus_lemerlei",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Artiodactyla" },
      { rank: "Clade",     value: "Cetancodonta" },
      { rank: "Family",    value: "Hippopotamidae" },
      { rank: "Genus",     value: "Hippopotamus" },
    ]
  },
  {
    id: 272, name: "Hippopotamus madagascariensis",
    periodName: "Pleistocene–Holocene", periodStart: 2, periodEnd: 0.001,
    wikiSlug: "Hippopotamus_madagascariensis",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Artiodactyla" },
      { rank: "Clade",     value: "Cetancodonta" },
      { rank: "Family",    value: "Hippopotamidae" },
      { rank: "Genus",     value: "Hippopotamus" },
    ]
  },
  {
    id: 273, name: "Aldabrachelys abrupta",
    periodName: "Holocene", periodStart: 0.05, periodEnd: 0.0008,
    wikiSlug: "Aldabrachelys_abrupta",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Diapsida" },
      { rank: "Order",     value: "Testudines" },
      { rank: "Suborder",  value: "Cryptodira" },
      { rank: "Family",    value: "Testudinidae" },
      { rank: "Genus",     value: "Aldabrachelys" },
    ]
  },
  {
    id: 274, name: "Aldabrachelys grandidieri",
    periodName: "Holocene", periodStart: 0.05, periodEnd: 0.0005,
    wikiSlug: "Aldabrachelys_grandidieri",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Diapsida" },
      { rank: "Order",     value: "Testudines" },
      { rank: "Suborder",  value: "Cryptodira" },
      { rank: "Family",    value: "Testudinidae" },
      { rank: "Genus",     value: "Aldabrachelys" },
    ]
  },
  {
    id: 275, name: "Stephanoaetus mahery",
    periodName: "Holocene", periodStart: 0.1, periodEnd: 0.0005,
    wikiSlug: "Malagasy_crowned_eagle",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Neognathae" },
      { rank: "Clade",     value: "Neoaves" },
      { rank: "Clade",     value: "Telluraves" },
      { rank: "Clade",     value: "Afroaves" },
      { rank: "Order",     value: "Accipitriformes" },
      { rank: "Family",    value: "Accipitridae" },
      { rank: "Genus",     value: "Stephanoaetus" },
    ]
  },
  {
    id: 276, name: "Coua delalandei",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 3.4e-05,
    wikiSlug: "Delalande%27s_coua",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Neognathae" },
      { rank: "Clade",     value: "Neoaves" },
      { rank: "Clade",     value: "Otidimorphae" },
      { rank: "Order",     value: "Cuculiformes" },
      { rank: "Family",    value: "Cuculidae" },
      { rank: "Genus",     value: "Coua" },
    ]
  },
  {
    id: 277, name: "Plesiorycteropus",
    periodName: "Holocene", periodStart: 0.1, periodEnd: 0.001,
    wikiSlug: "Plesiorycteropus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Afrotheria" },
      { rank: "Order",     value: "Tenrecoidea" },
      { rank: "Family",    value: "Plesiorycteropodidae" },
      { rank: "Genus",     value: "Plesiorycteropus" },
    ]
  },
  {
    id: 278, name: "Hypogeomys australis",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 0.001,
    wikiSlug: "Hypogeomys_australis",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Euarchontoglires" },
      { rank: "Order",     value: "Rodentia" },
      { rank: "Suborder",  value: "Myomorpha" },
      { rank: "Family",    value: "Nesomyidae" },
      { rank: "Subfamily", value: "Nesomyinae" },
      { rank: "Genus",     value: "Hypogeomys" },
    ]
  },
  // ── BATCH 24 — Recently Extinct ──────────────────────────────
  {
    id: 279, name: "Rodrigues Solitaire",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 0.000248,
    wikiSlug: "Rodrigues_solitaire",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Neognathae" },
      { rank: "Clade",     value: "Neoaves" },
      { rank: "Clade",     value: "Columbimorphae" },
      { rank: "Order",     value: "Columbiformes" },
      { rank: "Family",    value: "Columbidae" },
      { rank: "Subfamily", value: "Raphinae" },
      { rank: "Genus",     value: "Pezophaps" },
    ]
  },
  {
    id: 280, name: "Carolina Parakeet",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 8.1e-05,
    wikiSlug: "Carolina_parakeet",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Neognathae" },
      { rank: "Clade",     value: "Neoaves" },
      { rank: "Clade",     value: "Telluraves" },
      { rank: "Clade",     value: "Australaves" },
      { rank: "Order",     value: "Psittaciformes" },
      { rank: "Family",    value: "Psittacidae" },
      { rank: "Subfamily", value: "Arinae" },
      { rank: "Genus",     value: "Conuropsis" },
    ]
  },
  {
    id: 281, name: "Schomburgk's Deer",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 4.8e-05,
    wikiSlug: "Schomburgk%27s_deer",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Artiodactyla" },
      { rank: "Clade",     value: "Ruminantia" },
      { rank: "Family",    value: "Cervidae" },
      { rank: "Subfamily", value: "Cervinae" },
      { rank: "Genus",     value: "Rucervus" },
    ]
  },
  {
    id: 282, name: "Falkland Islands Wolf",
    periodName: "Holocene", periodStart: 0.004, periodEnd: 0.000148,
    wikiSlug: "Falkland_Islands_wolf",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Carnivora" },
      { rank: "Suborder",  value: "Caniformia" },
      { rank: "Family",    value: "Canidae" },
      { rank: "Genus",     value: "Dusicyon" },
    ]
  },
  {
    id: 283, name: "Japanese Sea Lion",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 6e-05,
    wikiSlug: "Japanese_sea_lion",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Carnivora" },
      { rank: "Suborder",  value: "Caniformia" },
      { rank: "Family",    value: "Otariidae" },
      { rank: "Genus",     value: "Zalophus" },
    ]
  },
  {
    id: 284, name: "Caribbean Monk Seal",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 4.8e-05,
    wikiSlug: "Caribbean_monk_seal",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Carnivora" },
      { rank: "Suborder",  value: "Caniformia" },
      { rank: "Family",    value: "Phocidae" },
      { rank: "Subfamily", value: "Monachinae" },
      { rank: "Genus",     value: "Neomonachus" },
    ]
  },
  {
    id: 285, name: "Bluebuck",
    periodName: "Holocene", periodStart: 0.1, periodEnd: 0.0002,
    wikiSlug: "Bluebuck",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Artiodactyla" },
      { rank: "Clade",     value: "Ruminantia" },
      { rank: "Family",    value: "Bovidae" },
      { rank: "Subfamily", value: "Hippotraginae" },
      { rank: "Genus",     value: "Hippotragus" },
    ]
  },
  {
    id: 286, name: "Atlas Bear",
    periodName: "Holocene", periodStart: 0.1, periodEnd: 0.00013,
    wikiSlug: "Atlas_bear",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Carnivora" },
      { rank: "Suborder",  value: "Caniformia" },
      { rank: "Family",    value: "Ursidae" },
      { rank: "Subfamily", value: "Ursinae" },
      { rank: "Genus",     value: "Ursus" },
    ]
  },
  {
    id: 287, name: "Cape Lion",
    periodName: "Holocene", periodStart: 0.1, periodEnd: 0.000148,
    wikiSlug: "Cape_lion",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Carnivora" },
      { rank: "Suborder",  value: "Feliformia" },
      { rank: "Family",    value: "Felidae" },
      { rank: "Subfamily", value: "Pantherinae" },
      { rank: "Genus",     value: "Panthera" },
    ]
  },
  {
    id: 288, name: "Pinta Island Tortoise",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 8e-06,
    wikiSlug: "Pinta_Island_tortoise",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Diapsida" },
      { rank: "Order",     value: "Testudines" },
      { rank: "Suborder",  value: "Cryptodira" },
      { rank: "Family",    value: "Testudinidae" },
      { rank: "Genus",     value: "Chelonoidis" },
    ]
  },
  {
    id: 289, name: "Golden Toad",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 3.1e-05,
    wikiSlug: "Golden_toad",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Class",     value: "Amphibia" },
      { rank: "Clade",     value: "Batrachia" },
      { rank: "Order",     value: "Anura" },
      { rank: "Family",    value: "Bufonidae" },
      { rank: "Genus",     value: "Incilius" },
    ]
  },
  {
    id: 290, name: "Pyrenean Ibex",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 0.0,
    wikiSlug: "Pyrenean_ibex",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Artiodactyla" },
      { rank: "Clade",     value: "Ruminantia" },
      { rank: "Family",    value: "Bovidae" },
      { rank: "Subfamily", value: "Caprinae" },
      { rank: "Genus",     value: "Capra" },
    ]
  },
  {
    id: 291, name: "Heath Hen",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 6.8e-05,
    wikiSlug: "Heath_hen",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Neognathae" },
      { rank: "Clade",     value: "Galloanserae" },
      { rank: "Order",     value: "Galliformes" },
      { rank: "Family",    value: "Phasianidae" },
      { rank: "Subfamily", value: "Tetraoninae" },
      { rank: "Genus",     value: "Tympanuchus" },
    ]
  },
  {
    id: 292, name: "Stephens Island Wren",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 0.000108,
    wikiSlug: "Stephens_Island_wren",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Neognathae" },
      { rank: "Clade",     value: "Neoaves" },
      { rank: "Clade",     value: "Telluraves" },
      { rank: "Clade",     value: "Australaves" },
      { rank: "Order",     value: "Passeriformes" },
      { rank: "Family",    value: "Acanthisittidae" },
      { rank: "Genus",     value: "Traversia" },
    ]
  },
  {
    id: 293, name: "Huia",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 0.000108,
    wikiSlug: "Huia",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Neognathae" },
      { rank: "Clade",     value: "Neoaves" },
      { rank: "Clade",     value: "Telluraves" },
      { rank: "Clade",     value: "Australaves" },
      { rank: "Order",     value: "Passeriformes" },
      { rank: "Family",    value: "Callaeidae" },
      { rank: "Genus",     value: "Heteralocha" },
    ]
  },
  {
    id: 294, name: "Laughing Owl",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 0.000108,
    wikiSlug: "Laughing_owl",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Neognathae" },
      { rank: "Clade",     value: "Neoaves" },
      { rank: "Clade",     value: "Telluraves" },
      { rank: "Clade",     value: "Afroaves" },
      { rank: "Order",     value: "Strigiformes" },
      { rank: "Family",    value: "Strigidae" },
      { rank: "Genus",     value: "Ninox" },
    ]
  },
  {
    id: 295, name: "Paradise Parakeet",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 7.8e-05,
    wikiSlug: "Paradise_parrot",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Neognathae" },
      { rank: "Clade",     value: "Neoaves" },
      { rank: "Clade",     value: "Telluraves" },
      { rank: "Clade",     value: "Australaves" },
      { rank: "Order",     value: "Psittaciformes" },
      { rank: "Family",    value: "Psittaculidae" },
      { rank: "Genus",     value: "Psephotellus" },
    ]
  },
  {
    id: 296, name: "New Zealand Quail",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 0.000158,
    wikiSlug: "New_Zealand_quail",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Neognathae" },
      { rank: "Clade",     value: "Galloanserae" },
      { rank: "Order",     value: "Galliformes" },
      { rank: "Family",    value: "Phasianidae" },
      { rank: "Subfamily", value: "Perdicinae" },
      { rank: "Genus",     value: "Coturnix" },
    ]
  },
  {
    id: 297, name: "Ivory-billed Woodpecker",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 2e-05,
    wikiSlug: "Ivory-billed_woodpecker",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Neognathae" },
      { rank: "Clade",     value: "Neoaves" },
      { rank: "Clade",     value: "Telluraves" },
      { rank: "Clade",     value: "Afroaves" },
      { rank: "Order",     value: "Piciformes" },
      { rank: "Family",    value: "Picidae" },
      { rank: "Subfamily", value: "Picinae" },
      { rank: "Genus",     value: "Campephilus" },
    ]
  },
  {
    id: 298, name: "Kamaʻo",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 8e-06,
    wikiSlug: "Kama%CA%BBo",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Neognathae" },
      { rank: "Clade",     value: "Neoaves" },
      { rank: "Clade",     value: "Telluraves" },
      { rank: "Clade",     value: "Australaves" },
      { rank: "Order",     value: "Passeriformes" },
      { rank: "Family",    value: "Turdidae" },
      { rank: "Genus",     value: "Myadestes" },
    ]
  },
  {
    id: 299, name: "Toolache Wallaby",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 6.8e-05,
    wikiSlug: "Toolache_wallaby",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Metatheria" },
      { rank: "Order",     value: "Diprotodontia" },
      { rank: "Family",    value: "Macropodidae" },
      { rank: "Genus",     value: "Notamacropus" },
    ]
  },
  {
    id: 300, name: "Desert Rat-Kangaroo",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 6.8e-05,
    wikiSlug: "Desert_rat-kangaroo",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Metatheria" },
      { rank: "Order",     value: "Diprotodontia" },
      { rank: "Family",    value: "Potoroidae" },
      { rank: "Genus",     value: "Caloprymnus" },
    ]
  },
  {
    id: 301, name: "Pig-footed Bandicoot",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 5e-05,
    wikiSlug: "Pig-footed_bandicoot",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Metatheria" },
      { rank: "Order",     value: "Peramelemorphia" },
      { rank: "Family",    value: "Chaeropodidae" },
      { rank: "Genus",     value: "Chaeropus" },
    ]
  },
  // ── BATCH 25 — Cretaceous Madagascar ─────────────────────────
  {
    id: 302, name: "Majungasaurus",
    periodName: "Late Cretaceous", periodStart: 70, periodEnd: 66,
    wikiSlug: "Majungasaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Theropoda" },
      { rank: "Clade",     value: "Ceratosauria" },
      { rank: "Family",    value: "Abelisauridae" },
      { rank: "Subfamily", value: "Majungasaurinae" },
      { rank: "Genus",     value: "Majungasaurus" },
    ]
  },
  {
    id: 303, name: "Masiakasaurus",
    periodName: "Late Cretaceous", periodStart: 70, periodEnd: 66,
    wikiSlug: "Masiakasaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Theropoda" },
      { rank: "Clade",     value: "Ceratosauria" },
      { rank: "Family",    value: "Noasauridae" },
      { rank: "Genus",     value: "Masiakasaurus" },
    ]
  },
  {
    id: 304, name: "Rapetosaurus",
    periodName: "Late Cretaceous", periodStart: 70, periodEnd: 66,
    wikiSlug: "Rapetosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Sauropodomorpha" },
      { rank: "Clade",     value: "Sauropoda" },
      { rank: "Clade",     value: "Eusauropoda" },
      { rank: "Clade",     value: "Macronaria" },
      { rank: "Clade",     value: "Titanosauriformes" },
      { rank: "Clade",     value: "Titanosauria" },
      { rank: "Family",    value: "Nemegtosauridae" },
      { rank: "Genus",     value: "Rapetosaurus" },
    ]
  },
  {
    id: 305, name: "Beelzebufo",
    periodName: "Late Cretaceous", periodStart: 70, periodEnd: 66,
    wikiSlug: "Beelzebufo",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Class",     value: "Amphibia" },
      { rank: "Clade",     value: "Batrachia" },
      { rank: "Order",     value: "Anura" },
      { rank: "Family",    value: "Ceratophryidae" },
      { rank: "Genus",     value: "Beelzebufo" },
    ]
  },
  {
    id: 306, name: "Mahajangasuchus",
    periodName: "Late Cretaceous", periodStart: 70, periodEnd: 66,
    wikiSlug: "Mahajangasuchus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Pseudosuchia" },
      { rank: "Order",     value: "Crocodilia" },
      { rank: "Clade",     value: "Eusuchia" },
      { rank: "Family",    value: "Mahajangasuchidae" },
      { rank: "Genus",     value: "Mahajangasuchus" },
    ]
  },
  {
    id: 307, name: "Adalatherium",
    periodName: "Late Cretaceous", periodStart: 70, periodEnd: 66,
    wikiSlug: "Adalatherium",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Gondwanatheria" },
      { rank: "Family",    value: "Adalatheriidae" },
      { rank: "Genus",     value: "Adalatherium" },
    ]
  },
  {
    id: 308, name: "Rahonavis",
    periodName: "Late Cretaceous", periodStart: 70, periodEnd: 66,
    wikiSlug: "Rahonavis",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Clade",     value: "Paraves" },
      { rank: "Family",    value: "Dromaeosauridae" },
      { rank: "Genus",     value: "Rahonavis" },
    ]
  },
  {
    id: 309, name: "Vahiny",
    periodName: "Late Cretaceous", periodStart: 70, periodEnd: 66,
    wikiSlug: "Vahiny",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Sauropodomorpha" },
      { rank: "Clade",     value: "Sauropoda" },
      { rank: "Clade",     value: "Eusauropoda" },
      { rank: "Clade",     value: "Macronaria" },
      { rank: "Clade",     value: "Titanosauriformes" },
      { rank: "Clade",     value: "Titanosauria" },
      { rank: "Family",    value: "Nemegtosauridae" },
      { rank: "Genus",     value: "Vahiny" },
    ]
  },
  {
    id: 310, name: "Lapparentosaurus",
    periodName: "Middle Jurassic", periodStart: 168, periodEnd: 163,
    wikiSlug: "Lapparentosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Clade",     value: "Sauropodomorpha" },
      { rank: "Clade",     value: "Sauropoda" },
      { rank: "Clade",     value: "Eusauropoda" },
      { rank: "Family",    value: "Cetiosauridae" },
      { rank: "Genus",     value: "Lapparentosaurus" },
    ]
  },
  // ── BATCH 26 — Modern Extinctions & Prehistoric Oddities ─────
  {
    id: 311, name: "Baiji",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 8e-06,
    wikiSlug: "Baiji",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Artiodactyla" },
      { rank: "Clade",     value: "Cetancodonta" },
      { rank: "Clade",     value: "Cetacea" },
      { rank: "Suborder",  value: "Odontoceti" },
      { rank: "Family",    value: "Lipotidae" },
      { rank: "Genus",     value: "Lipotes" },
    ]
  },
  {
    id: 312, name: "Western Black Rhino",
    periodName: "Holocene", periodStart: 0.1, periodEnd: 8e-06,
    wikiSlug: "Western_black_rhinoceros",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Perissodactyla" },
      { rank: "Clade",     value: "Ceratomorpha" },
      { rank: "Clade",     value: "Rhinocerotoidea" },
      { rank: "Family",    value: "Rhinocerotidae" },
      { rank: "Subfamily", value: "Rhinocerotinae" },
      { rank: "Genus",     value: "Diceros" },
    ]
  },
  {
    id: 313, name: "Bramble Cay Melomys",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 1e-05,
    wikiSlug: "Bramble_Cay_melomys",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Euarchontoglires" },
      { rank: "Order",     value: "Rodentia" },
      { rank: "Suborder",  value: "Myomorpha" },
      { rank: "Family",    value: "Muridae" },
      { rank: "Genus",     value: "Melomys" },
    ]
  },
  {
    id: 314, name: "Christmas Island Pipistrelle",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 9e-06,
    wikiSlug: "Christmas_Island_pipistrelle",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Chiroptera" },
      { rank: "Family",    value: "Vespertilionidae" },
      { rank: "Subfamily", value: "Vespertilioninae" },
      { rank: "Genus",     value: "Pipistrellus" },
    ]
  },
  {
    id: 315, name: "Japanese Wolf",
    periodName: "Holocene", periodStart: 0.1, periodEnd: 0.000108,
    wikiSlug: "Japanese_wolf",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Carnivora" },
      { rank: "Suborder",  value: "Caniformia" },
      { rank: "Family",    value: "Canidae" },
      { rank: "Genus",     value: "Canis" },
    ]
  },
  {
    id: 316, name: "Caspian Tiger",
    periodName: "Holocene", periodStart: 0.1, periodEnd: 4.8e-05,
    wikiSlug: "Caspian_tiger",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Carnivora" },
      { rank: "Suborder",  value: "Feliformia" },
      { rank: "Family",    value: "Felidae" },
      { rank: "Subfamily", value: "Pantherinae" },
      { rank: "Genus",     value: "Panthera" },
    ]
  },
  {
    id: 317, name: "Javan Tiger",
    periodName: "Holocene", periodStart: 0.1, periodEnd: 3e-05,
    wikiSlug: "Javan_tiger",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Carnivora" },
      { rank: "Suborder",  value: "Feliformia" },
      { rank: "Family",    value: "Felidae" },
      { rank: "Subfamily", value: "Pantherinae" },
      { rank: "Genus",     value: "Panthera" },
    ]
  },
  {
    id: 318, name: "Bali Tiger",
    periodName: "Holocene", periodStart: 0.1, periodEnd: 4.8e-05,
    wikiSlug: "Bali_tiger",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Carnivora" },
      { rank: "Suborder",  value: "Feliformia" },
      { rank: "Family",    value: "Felidae" },
      { rank: "Subfamily", value: "Pantherinae" },
      { rank: "Genus",     value: "Panthera" },
    ]
  },
  {
    id: 319, name: "Zanzibar Leopard",
    periodName: "Holocene", periodStart: 0.1, periodEnd: 3e-05,
    wikiSlug: "Zanzibar_leopard",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Carnivora" },
      { rank: "Suborder",  value: "Feliformia" },
      { rank: "Family",    value: "Felidae" },
      { rank: "Subfamily", value: "Pantherinae" },
      { rank: "Genus",     value: "Panthera" },
    ]
  },
  {
    id: 320, name: "Mexican Grizzly Bear",
    periodName: "Holocene", periodStart: 0.1, periodEnd: 3e-05,
    wikiSlug: "Mexican_grizzly_bear",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Carnivora" },
      { rank: "Suborder",  value: "Caniformia" },
      { rank: "Family",    value: "Ursidae" },
      { rank: "Subfamily", value: "Ursinae" },
      { rank: "Genus",     value: "Ursus" },
    ]
  },
  {
    id: 321, name: "Bubal Hartebeest",
    periodName: "Holocene", periodStart: 0.1, periodEnd: 7.8e-05,
    wikiSlug: "Bubal_hartebeest",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Artiodactyla" },
      { rank: "Clade",     value: "Ruminantia" },
      { rank: "Family",    value: "Bovidae" },
      { rank: "Subfamily", value: "Alcelaphinae" },
      { rank: "Genus",     value: "Alcelaphus" },
    ]
  },
  {
    id: 322, name: "Crescent Nail-tail Wallaby",
    periodName: "Holocene", periodStart: 0.1, periodEnd: 5.6e-05,
    wikiSlug: "Crescent_nail-tail_wallaby",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Metatheria" },
      { rank: "Order",     value: "Diprotodontia" },
      { rank: "Family",    value: "Macropodidae" },
      { rank: "Genus",     value: "Onychogalea" },
    ]
  },
  {
    id: 323, name: "Lesser Bilby",
    periodName: "Holocene", periodStart: 0.1, periodEnd: 5.8e-05,
    wikiSlug: "Lesser_bilby",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Metatheria" },
      { rank: "Order",     value: "Peramelemorphia" },
      { rank: "Family",    value: "Thylacomyidae" },
      { rank: "Genus",     value: "Macrotis" },
    ]
  },
  {
    id: 324, name: "Broad-billed Parrot",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 0.000248,
    wikiSlug: "Broad-billed_parrot",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Neognathae" },
      { rank: "Clade",     value: "Neoaves" },
      { rank: "Clade",     value: "Telluraves" },
      { rank: "Clade",     value: "Australaves" },
      { rank: "Order",     value: "Psittaciformes" },
      { rank: "Family",    value: "Psittaculidae" },
      { rank: "Genus",     value: "Lophopsittacus" },
    ]
  },
  {
    id: 325, name: "Réunion Giant Tortoise",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 0.000248,
    wikiSlug: "R%C3%A9union_giant_tortoise",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Diapsida" },
      { rank: "Order",     value: "Testudines" },
      { rank: "Suborder",  value: "Cryptodira" },
      { rank: "Family",    value: "Testudinidae" },
      { rank: "Genus",     value: "Cylindraspis" },
    ]
  },
  {
    id: 326, name: "Formosan Clouded Leopard",
    periodName: "Holocene", periodStart: 0.1, periodEnd: 1.3e-05,
    wikiSlug: "Formosan_clouded_leopard",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Carnivora" },
      { rank: "Suborder",  value: "Feliformia" },
      { rank: "Family",    value: "Felidae" },
      { rank: "Subfamily", value: "Pantherinae" },
      { rank: "Genus",     value: "Neofelis" },
    ]
  },
  {
    id: 327, name: "Newfoundland Wolf",
    periodName: "Holocene", periodStart: 0.1, periodEnd: 5.8e-05,
    wikiSlug: "Newfoundland_wolf",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Carnivora" },
      { rank: "Suborder",  value: "Caniformia" },
      { rank: "Family",    value: "Canidae" },
      { rank: "Genus",     value: "Canis" },
    ]
  },
  {
    id: 328, name: "Sea Mink",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 0.000148,
    wikiSlug: "Sea_mink",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Carnivora" },
      { rank: "Suborder",  value: "Caniformia" },
      { rank: "Family",    value: "Mustelidae" },
      { rank: "Subfamily", value: "Mustelinae" },
      { rank: "Genus",     value: "Neovison" },
    ]
  },
  {
    id: 329, name: "Labrador Duck",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 0.000158,
    wikiSlug: "Labrador_duck",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Neognathae" },
      { rank: "Clade",     value: "Galloanserae" },
      { rank: "Order",     value: "Anseriformes" },
      { rank: "Family",    value: "Anatidae" },
      { rank: "Genus",     value: "Camptorhynchus" },
    ]
  },
  {
    id: 330, name: "Eskimo Curlew",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 3.8e-05,
    wikiSlug: "Eskimo_curlew",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Neognathae" },
      { rank: "Clade",     value: "Neoaves" },
      { rank: "Clade",     value: "Charadriimorphae" },
      { rank: "Order",     value: "Charadriiformes" },
      { rank: "Family",    value: "Scolopacidae" },
      { rank: "Genus",     value: "Numenius" },
    ]
  },
  {
    id: 331, name: "Great Dusky Seaside Sparrow",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 1.3e-05,
    wikiSlug: "Dusky_seaside_sparrow",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Neognathae" },
      { rank: "Clade",     value: "Neoaves" },
      { rank: "Clade",     value: "Telluraves" },
      { rank: "Clade",     value: "Australaves" },
      { rank: "Order",     value: "Passeriformes" },
      { rank: "Family",    value: "Passerellidae" },
      { rank: "Genus",     value: "Ammospiza" },
    ]
  },
  {
    id: 332, name: "Poʻouli",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 8e-06,
    wikiSlug: "Po%CA%BBouli",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Neognathae" },
      { rank: "Clade",     value: "Neoaves" },
      { rank: "Clade",     value: "Telluraves" },
      { rank: "Clade",     value: "Australaves" },
      { rank: "Order",     value: "Passeriformes" },
      { rank: "Family",    value: "Fringillidae" },
      { rank: "Subfamily", value: "Carduelinae" },
      { rank: "Genus",     value: "Melamprosops" },
    ]
  },
  {
    id: 333, name: "Guam Flying Fox",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 3.3e-05,
    wikiSlug: "Guam_flying_fox",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Chiroptera" },
      { rank: "Family",    value: "Pteropodidae" },
      { rank: "Genus",     value: "Pteropus" },
    ]
  },
  {
    id: 334, name: "Pagan Reed-warbler",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 8e-06,
    wikiSlug: "Pagan_reed_warbler",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Neognathae" },
      { rank: "Clade",     value: "Neoaves" },
      { rank: "Clade",     value: "Telluraves" },
      { rank: "Clade",     value: "Australaves" },
      { rank: "Order",     value: "Passeriformes" },
      { rank: "Family",    value: "Acrocephalidae" },
      { rank: "Genus",     value: "Acrocephalus" },
    ]
  },
  {
    id: 335, name: "Alaotra Grebe",
    periodName: "Holocene", periodStart: 0.1, periodEnd: 0.0,
    wikiSlug: "Alaotra_grebe",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Neognathae" },
      { rank: "Clade",     value: "Neoaves" },
      { rank: "Clade",     value: "Mirandornithes" },
      { rank: "Order",     value: "Podicipediformes" },
      { rank: "Family",    value: "Podicipedidae" },
      { rank: "Genus",     value: "Tachybaptus" },
    ]
  },
  {
    id: 336, name: "Slender-billed Curlew",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 8e-06,
    wikiSlug: "Slender-billed_curlew",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Neognathae" },
      { rank: "Clade",     value: "Neoaves" },
      { rank: "Clade",     value: "Charadriimorphae" },
      { rank: "Order",     value: "Charadriiformes" },
      { rank: "Family",    value: "Scolopacidae" },
      { rank: "Genus",     value: "Numenius" },
    ]
  },
  {
    id: 337, name: "Christmas Island Shrew",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 2.8e-05,
    wikiSlug: "Christmas_Island_shrew",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Boreoeutheria" },
      { rank: "Clade",     value: "Laurasiatheria" },
      { rank: "Order",     value: "Eulipotyphla" },
      { rank: "Family",    value: "Soricidae" },
      { rank: "Subfamily", value: "Crocidurinae" },
      { rank: "Genus",     value: "Crocidura" },
    ]
  },
  {
    id: 338, name: "Nullarbor Barred Bandicoot",
    periodName: "Holocene", periodStart: 0.1, periodEnd: 6.8e-05,
    wikiSlug: "Nullarbor_barred_bandicoot",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Metatheria" },
      { rank: "Order",     value: "Peramelemorphia" },
      { rank: "Family",    value: "Peramelidae" },
      { rank: "Genus",     value: "Perameles" },
    ]
  },
  {
    id: 339, name: "Canary Islands Oystercatcher",
    periodName: "Holocene", periodStart: 0.1, periodEnd: 0.000148,
    wikiSlug: "Canary_Islands_oystercatcher",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Neognathae" },
      { rank: "Clade",     value: "Neoaves" },
      { rank: "Clade",     value: "Charadriimorphae" },
      { rank: "Order",     value: "Charadriiformes" },
      { rank: "Family",    value: "Haematopodidae" },
      { rank: "Genus",     value: "Haematopus" },
    ]
  },
  {
    id: 340, name: "Wake Island Rail",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 7.8e-05,
    wikiSlug: "Wake_Island_rail",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Neognathae" },
      { rank: "Clade",     value: "Neoaves" },
      { rank: "Order",     value: "Gruiformes" },
      { rank: "Family",    value: "Rallidae" },
      { rank: "Genus",     value: "Gallirallus" },
    ]
  },
  {
    id: 341, name: "Lord Howe Island Stick Insect",
    periodName: "Holocene", periodStart: 0.01, periodEnd: 0.000108,
    wikiSlug: "Lord_Howe_Island_stick_insect",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Arthropoda" },
      { rank: "Class",     value: "Insecta" },
      { rank: "Clade",     value: "Pterygota" },
      { rank: "Clade",     value: "Polyneoptera" },
      { rank: "Order",     value: "Phasmatodea" },
      { rank: "Family",    value: "Phasmatidae" },
      { rank: "Subfamily", value: "Eurycanthinae" },
      { rank: "Genus",     value: "Dryococelus" },
    ]
  },
  {
    id: 342, name: "Tully Monster",
    periodName: "Carboniferous", periodStart: 307, periodEnd: 303,
    wikiSlug: "Tullimonstrum",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Class",     value: "Petromyzontida" },
      { rank: "Family",    value: "Tullimonstridae" },
      { rank: "Genus",     value: "Tullimonstrum" },
    ]
  },
  {
    id: 343, name: "Inkayacu",
    periodName: "Late Eocene", periodStart: 36, periodEnd: 33,
    wikiSlug: "Inkayacu",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Palaeognathae" },
      { rank: "Order",     value: "Sphenisciformes" },
      { rank: "Family",    value: "Spheniscidae" },
      { rank: "Genus",     value: "Inkayacu" },
    ]
  },
  {
    id: 344, name: "Kairuku",
    periodName: "Late Oligocene", periodStart: 27, periodEnd: 24,
    wikiSlug: "Kairuku",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Palaeognathae" },
      { rank: "Order",     value: "Sphenisciformes" },
      { rank: "Family",    value: "Spheniscidae" },
      { rank: "Genus",     value: "Kairuku" },
    ]
  },
  {
    id: 345, name: "Palaeeudyptes",
    periodName: "Late Eocene–Oligocene", periodStart: 37, periodEnd: 27,
    wikiSlug: "Palaeeudyptes",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Palaeognathae" },
      { rank: "Order",     value: "Sphenisciformes" },
      { rank: "Family",    value: "Spheniscidae" },
      { rank: "Genus",     value: "Palaeeudyptes" },
    ]
  },
  {
    id: 346, name: "Icadyptes",
    periodName: "Late Eocene", periodStart: 36, periodEnd: 33,
    wikiSlug: "Icadyptes",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Class",     value: "Aves" },
      { rank: "Clade",     value: "Palaeognathae" },
      { rank: "Order",     value: "Sphenisciformes" },
      { rank: "Family",    value: "Spheniscidae" },
      { rank: "Genus",     value: "Icadyptes" },
    ]
  },
  {
    id: 347, name: "Carcharodontosaurus",
    periodName: "Late Cretaceous", periodStart: 99, periodEnd: 93,
    wikiSlug: "Carcharodontosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Avetheropoda" },
      { rank: "Clade",     value: "Carnosauria" },
      { rank: "Clade",     value: "Allosauroidea" },
{ rank: "Family",    value: "Carcharodontosauridae" },
      { rank: "Genus",     value: "Carcharodontosaurus" },
    ]
  },
  {
    id: 348, name: "Acrocanthosaurus",
    periodName: "Early Cretaceous", periodStart: 125, periodEnd: 100,
    wikiSlug: "Acrocanthosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Avetheropoda" },
      { rank: "Clade",     value: "Carnosauria" },
      { rank: "Clade",     value: "Allosauroidea" },
{ rank: "Family",    value: "Carcharodontosauridae" },
      { rank: "Genus",     value: "Acrocanthosaurus" },
    ]
  },
  {
    id: 349, name: "Mapusaurus",
    periodName: "Late Cretaceous", periodStart: 97, periodEnd: 93,
    wikiSlug: "Mapusaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Avetheropoda" },
      { rank: "Clade",     value: "Carnosauria" },
      { rank: "Clade",     value: "Allosauroidea" },
{ rank: "Family",    value: "Carcharodontosauridae" },
      { rank: "Genus",     value: "Mapusaurus" },
    ]
  },
  {
    id: 350, name: "Tyrannotitan",
    periodName: "Early Cretaceous", periodStart: 112, periodEnd: 100,
    wikiSlug: "Tyrannotitan",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Avetheropoda" },
      { rank: "Clade",     value: "Carnosauria" },
      { rank: "Clade",     value: "Allosauroidea" },
{ rank: "Family",    value: "Carcharodontosauridae" },
      { rank: "Genus",     value: "Tyrannotitan" },
    ]
  },
  {
    id: 351, name: "Sauroniops",
    periodName: "Late Cretaceous", periodStart: 95, periodEnd: 93,
    wikiSlug: "Sauroniops",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Avetheropoda" },
      { rank: "Clade",     value: "Carnosauria" },
      { rank: "Clade",     value: "Allosauroidea" },
{ rank: "Family",    value: "Carcharodontosauridae" },
      { rank: "Genus",     value: "Sauroniops" },
    ]
  },
  {
    id: 352, name: "Shaochilong",
    periodName: "Late Cretaceous", periodStart: 92, periodEnd: 88,
    wikiSlug: "Shaochilong",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Avetheropoda" },
      { rank: "Clade",     value: "Carnosauria" },
      { rank: "Clade",     value: "Allosauroidea" },
{ rank: "Family",    value: "Carcharodontosauridae" },
      { rank: "Genus",     value: "Shaochilong" },
    ]
  },
  {
    id: 353, name: "Meraxes gigas",
    periodName: "Late Cretaceous", periodStart: 96, periodEnd: 90,
    wikiSlug: "Meraxes_gigas",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Avetheropoda" },
      { rank: "Clade",     value: "Carnosauria" },
      { rank: "Clade",     value: "Allosauroidea" },
{ rank: "Family",    value: "Carcharodontosauridae" },
      { rank: "Genus",     value: "Meraxes" },
    ]
  },
  {
    id: 354, name: "Eocarcharia",
    periodName: "Early Cretaceous", periodStart: 112, periodEnd: 100,
    wikiSlug: "Eocarcharia",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Avetheropoda" },
      { rank: "Clade",     value: "Carnosauria" },
      { rank: "Clade",     value: "Allosauroidea" },
{ rank: "Family",    value: "Carcharodontosauridae" },
      { rank: "Genus",     value: "Eocarcharia" },
    ]
  },
  {
    id: 355, name: "Veterupristisaurus",
    periodName: "Late Jurassic", periodStart: 155, periodEnd: 150,
    wikiSlug: "Veterupristisaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Avetheropoda" },
      { rank: "Clade",     value: "Carnosauria" },
      { rank: "Clade",     value: "Allosauroidea" },
{ rank: "Family",    value: "Carcharodontosauridae" },
      { rank: "Genus",     value: "Veterupristisaurus" },
    ]
  },
  {
    id: 356, name: "Ornithomimus",
    periodName: "Late Cretaceous", periodStart: 76, periodEnd: 66,
    wikiSlug: "Ornithomimus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Ornithomimosauria" },
{ rank: "Family",    value: "Ornithomimidae" },
      { rank: "Genus",     value: "Ornithomimus" },
    ]
  },
  {
    id: 357, name: "Dromiceiomimus",
    periodName: "Late Cretaceous", periodStart: 76, periodEnd: 66,
    wikiSlug: "Dromiceiomimus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Ornithomimosauria" },
{ rank: "Family",    value: "Ornithomimidae" },
      { rank: "Genus",     value: "Dromiceiomimus" },
    ]
  },
  {
    id: 358, name: "Archaeornithomimus",
    periodName: "Late Cretaceous", periodStart: 96, periodEnd: 89,
    wikiSlug: "Archaeornithomimus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Ornithomimosauria" },
{ rank: "Family",    value: "Ornithomimidae" },
      { rank: "Genus",     value: "Archaeornithomimus" },
    ]
  },
  {
    id: 359, name: "Pelecanimimus",
    periodName: "Early Cretaceous", periodStart: 130, periodEnd: 125,
    wikiSlug: "Pelecanimimus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Ornithomimosauria" },
{ rank: "Family",    value: "Pelecanimimidae" },
      { rank: "Genus",     value: "Pelecanimimus" },
    ]
  },
  {
    id: 360, name: "Anserimimus",
    periodName: "Late Cretaceous", periodStart: 70, periodEnd: 66,
    wikiSlug: "Anserimimus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Ornithomimosauria" },
{ rank: "Family",    value: "Ornithomimidae" },
      { rank: "Genus",     value: "Anserimimus" },
    ]
  },
  {
    id: 361, name: "Garudimimus",
    periodName: "Late Cretaceous", periodStart: 90, periodEnd: 85,
    wikiSlug: "Garudimimus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Ornithomimosauria" },
{ rank: "Family",    value: "Garudimimidae" },
      { rank: "Genus",     value: "Garudimimus" },
    ]
  },
  {
    id: 362, name: "Beishanlong",
    periodName: "Early Cretaceous", periodStart: 112, periodEnd: 100,
    wikiSlug: "Beishanlong",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Ornithomimosauria" },
{ rank: "Family",    value: "Ornithomimidae" },
      { rank: "Genus",     value: "Beishanlong" },
    ]
  },
  {
    id: 363, name: "Aepyornithomimus",
    periodName: "Late Cretaceous", periodStart: 90, periodEnd: 85,
    wikiSlug: "Aepyornithomimus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Ornithomimosauria" },
{ rank: "Family",    value: "Ornithomimidae" },
      { rank: "Genus",     value: "Aepyornithomimus" },
    ]
  },
  {
    id: 364, name: "Abelisaurus",
    periodName: "Late Cretaceous", periodStart: 83, periodEnd: 66,
    wikiSlug: "Abelisaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Ceratosauria" },
      { rank: "Clade",     value: "Abelisauroidea" },
{ rank: "Family",    value: "Abelisauridae" },
      { rank: "Genus",     value: "Abelisaurus" },
    ]
  },
  {
    id: 365, name: "Rugops",
    periodName: "Late Cretaceous", periodStart: 95, periodEnd: 93,
    wikiSlug: "Rugops",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Ceratosauria" },
      { rank: "Clade",     value: "Abelisauroidea" },
{ rank: "Family",    value: "Abelisauridae" },
      { rank: "Genus",     value: "Rugops" },
    ]
  },
  {
    id: 366, name: "Ekrixinatosaurus",
    periodName: "Late Cretaceous", periodStart: 97, periodEnd: 93,
    wikiSlug: "Ekrixinatosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Ceratosauria" },
      { rank: "Clade",     value: "Abelisauroidea" },
{ rank: "Family",    value: "Abelisauridae" },
      { rank: "Genus",     value: "Ekrixinatosaurus" },
    ]
  },
  {
    id: 367, name: "Rajasaurus",
    periodName: "Late Cretaceous", periodStart: 70, periodEnd: 66,
    wikiSlug: "Rajasaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Ceratosauria" },
      { rank: "Clade",     value: "Abelisauroidea" },
{ rank: "Family",    value: "Abelisauridae" },
      { rank: "Genus",     value: "Rajasaurus" },
    ]
  },
  {
    id: 368, name: "Skorpiovenator",
    periodName: "Late Cretaceous", periodStart: 93, periodEnd: 89,
    wikiSlug: "Skorpiovenator",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Ceratosauria" },
      { rank: "Clade",     value: "Abelisauroidea" },
{ rank: "Family",    value: "Abelisauridae" },
      { rank: "Genus",     value: "Skorpiovenator" },
    ]
  },
  {
    id: 369, name: "Aucasaurus",
    periodName: "Late Cretaceous", periodStart: 83, periodEnd: 80,
    wikiSlug: "Aucasaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Ceratosauria" },
      { rank: "Clade",     value: "Abelisauroidea" },
{ rank: "Family",    value: "Abelisauridae" },
      { rank: "Genus",     value: "Aucasaurus" },
    ]
  },
  {
    id: 370, name: "Irritator",
    periodName: "Early Cretaceous", periodStart: 110, periodEnd: 100,
    wikiSlug: "Irritator",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Megalosauroidea" },
{ rank: "Family",    value: "Spinosauridae" },
      { rank: "Genus",     value: "Irritator" },
    ]
  },
  {
    id: 371, name: "Oxalaia",
    periodName: "Late Cretaceous", periodStart: 100, periodEnd: 93,
    wikiSlug: "Oxalaia",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Megalosauroidea" },
{ rank: "Family",    value: "Spinosauridae" },
      { rank: "Genus",     value: "Oxalaia" },
    ]
  },
  {
    id: 372, name: "Ichthyovenator",
    periodName: "Early Cretaceous", periodStart: 125, periodEnd: 113,
    wikiSlug: "Ichthyovenator",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Megalosauroidea" },
{ rank: "Family",    value: "Spinosauridae" },
      { rank: "Genus",     value: "Ichthyovenator" },
    ]
  },
  {
    id: 373, name: "Megalosaurus",
    periodName: "Middle Jurassic", periodStart: 168, periodEnd: 166,
    wikiSlug: "Megalosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Megalosauroidea" },
{ rank: "Family",    value: "Megalosauridae" },
      { rank: "Genus",     value: "Megalosaurus" },
    ]
  },
  {
    id: 374, name: "Torvosaurus",
    periodName: "Late Jurassic", periodStart: 153, periodEnd: 148,
    wikiSlug: "Torvosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Megalosauroidea" },
{ rank: "Family",    value: "Megalosauridae" },
      { rank: "Genus",     value: "Torvosaurus" },
    ]
  },
  {
    id: 375, name: "Afrovenator",
    periodName: "Middle Jurassic", periodStart: 167, periodEnd: 161,
    wikiSlug: "Afrovenator",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Megalosauroidea" },
{ rank: "Family",    value: "Megalosauridae" },
      { rank: "Genus",     value: "Afrovenator" },
    ]
  },
  {
    id: 376, name: "Piatnitzkysaurus",
    periodName: "Middle Jurassic", periodStart: 168, periodEnd: 163,
    wikiSlug: "Piatnitzkysaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Megalosauroidea" },
{ rank: "Family",    value: "Piatnitzkysauridae" },
      { rank: "Genus",     value: "Piatnitzkysaurus" },
    ]
  },
  {
    id: 377, name: "Guanlong",
    periodName: "Late Jurassic", periodStart: 160, periodEnd: 155,
    wikiSlug: "Guanlong",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Tyrannosauroidea" },
{ rank: "Family",    value: "Proceratosauridae" },
      { rank: "Genus",     value: "Guanlong" },
    ]
  },
  {
    id: 378, name: "Dilong",
    periodName: "Early Cretaceous", periodStart: 130, periodEnd: 125,
    wikiSlug: "Dilong_paradoxus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Tyrannosauroidea" },
      { rank: "Family",    value: "Proceratosauridae" },
      { rank: "Genus",     value: "Dilong" },
    ]
  },
  {
    id: 379, name: "Alioramus",
    periodName: "Late Cretaceous", periodStart: 70, periodEnd: 66,
    wikiSlug: "Alioramus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Tyrannosauroidea" },
{ rank: "Family",    value: "Tyrannosauridae" },
      { rank: "Genus",     value: "Alioramus" },
    ]
  },
  {
    id: 380, name: "Qianzhousaurus",
    periodName: "Late Cretaceous", periodStart: 72, periodEnd: 66,
    wikiSlug: "Qianzhousaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Tyrannosauroidea" },
{ rank: "Family",    value: "Tyrannosauridae" },
      { rank: "Genus",     value: "Qianzhousaurus" },
    ]
  },
  {
    id: 381, name: "Austroraptor",
    periodName: "Late Cretaceous", periodStart: 70, periodEnd: 66,
    wikiSlug: "Austroraptor",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Clade",     value: "Paraves" },
{ rank: "Family",    value: "Dromaeosauridae" },
      { rank: "Genus",     value: "Austroraptor" },
    ]
  },
  {
    id: 382, name: "Pyroraptor",
    periodName: "Late Cretaceous", periodStart: 70, periodEnd: 66,
    wikiSlug: "Pyroraptor",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Clade",     value: "Paraves" },
{ rank: "Family",    value: "Dromaeosauridae" },
      { rank: "Genus",     value: "Pyroraptor" },
    ]
  },
  {
    id: 383, name: "Dakotaraptor",
    periodName: "Late Cretaceous", periodStart: 66, periodEnd: 66,
    wikiSlug: "Dakotaraptor",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Clade",     value: "Paraves" },
{ rank: "Family",    value: "Dromaeosauridae" },
      { rank: "Genus",     value: "Dakotaraptor" },
    ]
  },
  {
    id: 384, name: "Buitreraptor",
    periodName: "Late Cretaceous", periodStart: 93, periodEnd: 89,
    wikiSlug: "Buitreraptor",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Clade",     value: "Paraves" },
{ rank: "Family",    value: "Dromaeosauridae" },
      { rank: "Genus",     value: "Buitreraptor" },
    ]
  },
  {
    id: 385, name: "Segnosaurus",
    periodName: "Late Cretaceous", periodStart: 99, periodEnd: 93,
    wikiSlug: "Segnosaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Clade",     value: "Therizinosauria" },
{ rank: "Family",    value: "Therizinosauridae" },
      { rank: "Genus",     value: "Segnosaurus" },
    ]
  },
  {
    id: 386, name: "Nothronychus",
    periodName: "Late Cretaceous", periodStart: 91, periodEnd: 89,
    wikiSlug: "Nothronychus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Clade",     value: "Therizinosauria" },
{ rank: "Family",    value: "Therizinosauridae" },
      { rank: "Genus",     value: "Nothronychus" },
    ]
  },
  {
    id: 387, name: "Falcarius",
    periodName: "Early Cretaceous", periodStart: 130, periodEnd: 124,
    wikiSlug: "Falcarius",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Clade",     value: "Maniraptora" },
      { rank: "Clade",     value: "Therizinosauria" },
{ rank: "Family",    value: "Therizinosauridae" },
      { rank: "Genus",     value: "Falcarius" },
    ]
  },
  {
    id: 388, name: "Chilesaurus",
    periodName: "Late Jurassic", periodStart: 150, periodEnd: 145,
    wikiSlug: "Chilesaurus",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Chilesauria" },
{ rank: "Family",    value: "Chilesauridae" },
      { rank: "Genus",     value: "Chilesaurus" },
    ]
  },
  {
    id: 389, name: "Sinosauropteryx",
    periodName: "Early Cretaceous", periodStart: 130, periodEnd: 125,
    wikiSlug: "Sinosauropteryx",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Archosauria" },
      { rank: "Clade",     value: "Dinosauria" },
      { rank: "Order",     value: "Saurischia" },
      { rank: "Suborder",  value: "Theropoda" },
      { rank: "Clade",     value: "Tetanurae" },
      { rank: "Clade",     value: "Coelurosauria" },
      { rank: "Family",    value: "Compsognathidae" },
      { rank: "Genus",     value: "Sinosauropteryx" },
    ]
  },
  {
    id: 390, name: "American Mastodon (Mastodon)",
    periodName: "Pleistocene", periodStart: 3.6, periodEnd: 0.011,
    wikiSlug: "Mammut_americanum",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Afrotheria" },
      { rank: "Order",     value: "Proboscidea" },
      { rank: "Clade",     value: "Mammutida" },
      { rank: "Family",    value: "Mammutidae" },
      { rank: "Genus",     value: "Mammut" },
    ]
  },
  {
    id: 391, name: "Mammut borsoni (European Mastodon)",
    periodName: "Miocene-Pliocene", periodStart: 8, periodEnd: 2.5,
    wikiSlug: "Mammut_borsoni",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Synapsida" },
      { rank: "Class",     value: "Mammalia" },
      { rank: "Clade",     value: "Theria" },
      { rank: "Clade",     value: "Eutheria" },
      { rank: "Clade",     value: "Afrotheria" },
      { rank: "Order",     value: "Proboscidea" },
      { rank: "Clade",     value: "Mammutida" },
      { rank: "Family",    value: "Mammutidae" },
      { rank: "Genus",     value: "Mammut" },
    ]
  },
  {
    id: 392, name: "Microraptor",
    periodName: "Early Cretaceous", periodStart: 125, periodEnd: 120,
    wikiSlug: "Microraptor",
    lineage: [
      { rank: "Kingdom", value: "Animalia" },
      { rank: "Phylum", value: "Chordata" },
      { rank: "Clade", value: "Vertebrata" },
      { rank: "Clade", value: "Tetrapoda" },
      { rank: "Clade", value: "Amniota" },
      { rank: "Clade", value: "Sauropsida" },
      { rank: "Class", value: "Reptilia" },
      { rank: "Clade", value: "Archosauria" },
      { rank: "Clade", value: "Dinosauria" },
      { rank: "Order", value: "Saurischia" },
      { rank: "Clade", value: "Theropoda" },
      { rank: "Clade", value: "Tetanurae" },
      { rank: "Clade", value: "Coelurosauria" },
      { rank: "Clade", value: "Maniraptora" },
      { rank: "Family", value: "Microraptoria" },
      { rank: "Genus", value: "Microraptor" },
    ]
  },
  {
    id: 393, name: "Entelodon (Hell Pig)",
    periodName: "Eocene-Oligocene", periodStart: 37, periodEnd: 28,
    wikiSlug: "Entelodon",
    lineage: [
      { rank: "Kingdom", value: "Animalia" },
      { rank: "Phylum", value: "Chordata" },
      { rank: "Clade", value: "Vertebrata" },
      { rank: "Clade", value: "Tetrapoda" },
      { rank: "Clade", value: "Amniota" },
      { rank: "Clade", value: "Synapsida" },
      { rank: "Class", value: "Mammalia" },
      { rank: "Clade", value: "Theria" },
      { rank: "Clade", value: "Eutheria" },
      { rank: "Clade", value: "Boreoeutheria" },
      { rank: "Clade", value: "Laurasiatheria" },
      { rank: "Order", value: "Artiodactyla" },
      { rank: "Clade", value: "Cetancodonta" },
      { rank: "Family", value: "Entelodontidae" },
      { rank: "Genus", value: "Entelodon" },
    ]
  },
  {
    id: 394, name: "Toxodon",
    periodName: "Pliocene-Pleistocene", periodStart: 2.6, periodEnd: 0.011,
    wikiSlug: "Toxodon",
    lineage: [
      { rank: "Kingdom", value: "Animalia" },
      { rank: "Phylum", value: "Chordata" },
      { rank: "Clade", value: "Vertebrata" },
      { rank: "Clade", value: "Tetrapoda" },
      { rank: "Clade", value: "Amniota" },
      { rank: "Clade", value: "Synapsida" },
      { rank: "Class", value: "Mammalia" },
      { rank: "Clade", value: "Theria" },
      { rank: "Clade", value: "Eutheria" },
      { rank: "Clade", value: "Atlantogenata" },
      { rank: "Order", value: "Notoungulata" },
      { rank: "Family", value: "Toxodontidae" },
      { rank: "Genus", value: "Toxodon" },
    ]
  },
  {
    id: 395, name: "Coelacanth",
    periodName: "Devonian-Present", periodStart: 400, periodEnd: 0,
    wikiSlug: "Coelacanth",
    lineage: [
      { rank: "Kingdom", value: "Animalia" },
      { rank: "Phylum", value: "Chordata" },
      { rank: "Clade", value: "Vertebrata" },
      { rank: "Clade", value: "Osteichthyes" },
      { rank: "Class", value: "Sarcopterygii" },
      { rank: "Order", value: "Coelacanthiformes" },
      { rank: "Family", value: "Latimeriidae" },
      { rank: "Genus", value: "Latimeria" },
    ]
  },
  {
    id: 396, name: "Pakicetus",
    periodName: "Early Eocene", periodStart: 53, periodEnd: 47,
    wikiSlug: "Pakicetus",
    lineage: [
      { rank: "Kingdom", value: "Animalia" },
      { rank: "Phylum", value: "Chordata" },
      { rank: "Clade", value: "Vertebrata" },
      { rank: "Clade", value: "Tetrapoda" },
      { rank: "Clade", value: "Amniota" },
      { rank: "Clade", value: "Synapsida" },
      { rank: "Class", value: "Mammalia" },
      { rank: "Clade", value: "Theria" },
      { rank: "Clade", value: "Eutheria" },
      { rank: "Clade", value: "Boreoeutheria" },
      { rank: "Clade", value: "Laurasiatheria" },
      { rank: "Order", value: "Artiodactyla" },
      { rank: "Clade", value: "Cetancodonta" },
      { rank: "Clade", value: "Cetacea" },
      { rank: "Clade", value: "Archaeoceti" },
      { rank: "Family", value: "Pakicetidae" },
      { rank: "Genus", value: "Pakicetus" },
    ]
  },
  {
    id: 397, name: "Ammonite",
    periodName: "Devonian-Cretaceous", periodStart: 400, periodEnd: 66,
    wikiSlug: "Ammonoidea",
    lineage: [
      { rank: "Kingdom", value: "Animalia" },
      { rank: "Phylum", value: "Mollusca" },
      { rank: "Class", value: "Cephalopoda" },
      { rank: "Subclass", value: "Ammonoidea" },
      { rank: "Order", value: "Ammonitida" },
      { rank: "Family", value: "Ammonitidae" },
    ]
  },
  {
    id: 398, name: "Confuciusornis",
    periodName: "Early Cretaceous", periodStart: 125, periodEnd: 120,
    wikiSlug: "Confuciusornis",
    lineage: [
      { rank: "Kingdom", value: "Animalia" },
      { rank: "Phylum", value: "Chordata" },
      { rank: "Clade", value: "Vertebrata" },
      { rank: "Clade", value: "Tetrapoda" },
      { rank: "Clade", value: "Amniota" },
      { rank: "Clade", value: "Sauropsida" },
      { rank: "Class", value: "Reptilia" },
      { rank: "Clade", value: "Archosauria" },
      { rank: "Clade", value: "Dinosauria" },
      { rank: "Order", value: "Saurischia" },
      { rank: "Clade", value: "Theropoda" },
      { rank: "Clade", value: "Tetanurae" },
      { rank: "Clade", value: "Coelurosauria" },
      { rank: "Clade", value: "Maniraptora" },
      { rank: "Clade", value: "Avialae" },
      { rank: "Family", value: "Confuciusornithidae" },
      { rank: "Genus", value: "Confuciusornis" },
    ]
  },
  {
    id: 399, name: "Cynognathus",
    periodName: "Early-Middle Triassic", periodStart: 247, periodEnd: 237,
    wikiSlug: "Cynognathus",
    lineage: [
      { rank: "Kingdom", value: "Animalia" },
      { rank: "Phylum", value: "Chordata" },
      { rank: "Clade", value: "Vertebrata" },
      { rank: "Clade", value: "Tetrapoda" },
      { rank: "Clade", value: "Amniota" },
      { rank: "Clade", value: "Synapsida" },
      { rank: "Order", value: "Therapsida" },
      { rank: "Suborder", value: "Cynodontia" },
      { rank: "Family", value: "Cynognathidae" },
      { rank: "Genus", value: "Cynognathus" },
    ]
  },
  {
    id: 400, name: "Morganucodon",
    periodName: "Late Triassic-Early Jurassic", periodStart: 205, periodEnd: 175,
    wikiSlug: "Morganucodon",
    lineage: [
      { rank: "Kingdom", value: "Animalia" },
      { rank: "Phylum", value: "Chordata" },
      { rank: "Clade", value: "Vertebrata" },
      { rank: "Clade", value: "Tetrapoda" },
      { rank: "Clade", value: "Amniota" },
      { rank: "Clade", value: "Synapsida" },
      { rank: "Class", value: "Mammalia" },
      { rank: "Order", value: "Morganucodonta" },
      { rank: "Family", value: "Morganucodontidae" },
      { rank: "Genus", value: "Morganucodon" },
    ]
  },
  {
    id: 401, name: "Temnodontosaurus",
    periodName: "Early Jurassic", periodStart: 200, periodEnd: 175,
    wikiSlug: "Temnodontosaurus",
    lineage: [
      { rank: "Kingdom", value: "Animalia" },
      { rank: "Phylum", value: "Chordata" },
      { rank: "Clade", value: "Vertebrata" },
      { rank: "Clade", value: "Tetrapoda" },
      { rank: "Clade", value: "Amniota" },
      { rank: "Clade", value: "Sauropsida" },
      { rank: "Class", value: "Reptilia" },
      { rank: "Clade", value: "Diapsida" },
      { rank: "Clade",     value: "Ichthyopterygia" },
      { rank: "Order", value: "Ichthyosauria" },
      { rank: "Family", value: "Temnodontosauridae" },
      { rank: "Genus", value: "Temnodontosaurus" },
    ]
  },
  {
    id: 402, name: "Platecarpus",
    periodName: "Late Cretaceous", periodStart: 86, periodEnd: 76,
    wikiSlug: "Platecarpus",
    lineage: [
      { rank: "Kingdom", value: "Animalia" },
      { rank: "Phylum", value: "Chordata" },
      { rank: "Clade", value: "Vertebrata" },
      { rank: "Clade", value: "Tetrapoda" },
      { rank: "Clade", value: "Amniota" },
      { rank: "Clade", value: "Sauropsida" },
      { rank: "Class", value: "Reptilia" },
      { rank: "Clade", value: "Diapsida" },
      { rank: "Order", value: "Squamata" },
      { rank: "Suborder", value: "Mosasauria" },
      { rank: "Family", value: "Plioplatecarpinae" },
      { rank: "Genus", value: "Platecarpus" },
    ]
  },
  {
    id: 403, name: "Indohyus",
    periodName: "Late Eocene", periodStart: 48, periodEnd: 47,
    wikiSlug: "Indohyus",
    lineage: [
      { rank: "Kingdom", value: "Animalia" },
      { rank: "Phylum", value: "Chordata" },
      { rank: "Clade", value: "Vertebrata" },
      { rank: "Clade", value: "Tetrapoda" },
      { rank: "Clade", value: "Amniota" },
      { rank: "Clade", value: "Synapsida" },
      { rank: "Class", value: "Mammalia" },
      { rank: "Clade", value: "Theria" },
      { rank: "Clade", value: "Eutheria" },
      { rank: "Clade", value: "Boreoeutheria" },
      { rank: "Clade", value: "Laurasiatheria" },
      { rank: "Order", value: "Artiodactyla" },
      { rank: "Clade", value: "Cetancodonta" },
      { rank: "Family", value: "Raoellidae" },
      { rank: "Genus", value: "Indohyus" },
    ]
  },
  {
    id: 404, name: "Rodhocetus",
    periodName: "Middle Eocene", periodStart: 47, periodEnd: 41,
    wikiSlug: "Rodhocetus",
    lineage: [
      { rank: "Kingdom", value: "Animalia" },
      { rank: "Phylum", value: "Chordata" },
      { rank: "Clade", value: "Vertebrata" },
      { rank: "Clade", value: "Tetrapoda" },
      { rank: "Clade", value: "Amniota" },
      { rank: "Clade", value: "Synapsida" },
      { rank: "Class", value: "Mammalia" },
      { rank: "Clade", value: "Theria" },
      { rank: "Clade", value: "Eutheria" },
      { rank: "Clade", value: "Boreoeutheria" },
      { rank: "Clade", value: "Laurasiatheria" },
      { rank: "Order", value: "Artiodactyla" },
      { rank: "Clade", value: "Cetancodonta" },
      { rank: "Clade", value: "Cetacea" },
      { rank: "Clade", value: "Archaeoceti" },
      { rank: "Family", value: "Protocetidae" },
      { rank: "Genus", value: "Rodhocetus" },
    ]
  },
  {
    id: 405, name: "Brontotherium (Thunder Beast)",
    periodName: "Late Eocene", periodStart: 37, periodEnd: 33,
    wikiSlug: "Megacerops",
    lineage: [
      { rank: "Kingdom", value: "Animalia" },
      { rank: "Phylum", value: "Chordata" },
      { rank: "Clade", value: "Vertebrata" },
      { rank: "Clade", value: "Tetrapoda" },
      { rank: "Clade", value: "Amniota" },
      { rank: "Clade", value: "Synapsida" },
      { rank: "Class", value: "Mammalia" },
      { rank: "Clade", value: "Theria" },
      { rank: "Clade", value: "Eutheria" },
      { rank: "Clade", value: "Boreoeutheria" },
      { rank: "Clade", value: "Laurasiatheria" },
      { rank: "Order", value: "Perissodactyla" },
      { rank: "Family", value: "Brontotheriidae" },
      { rank: "Genus", value: "Megacerops" },
    ]
  },
  {
    id: 406, name: "Enchodus (Sabre-tooth Herring)",
    periodName: "Cretaceous-Paleocene", periodStart: 100, periodEnd: 55,
    wikiSlug: "Enchodus",
    lineage: [
      { rank: "Kingdom", value: "Animalia" },
      { rank: "Phylum", value: "Chordata" },
      { rank: "Clade", value: "Vertebrata" },
      { rank: "Class", value: "Actinopterygii" },
      { rank: "Order", value: "Aulopiformes" },
      { rank: "Family", value: "Enchodontidae" },
      { rank: "Genus", value: "Enchodus" },
    ]
  },
  {
    id: 407, name: "Eurypterus (Sea Scorpion)",
    periodName: "Silurian", periodStart: 432, periodEnd: 418,
    wikiSlug: "Eurypterus",
    lineage: [
      { rank: "Kingdom", value: "Animalia" },
      { rank: "Phylum", value: "Arthropoda" },
      { rank: "Clade", value: "Chelicerata" },
      { rank: "Class", value: "Merostomata" },
      { rank: "Order", value: "Eurypterida" },
      { rank: "Family", value: "Eurypteridae" },
      { rank: "Genus", value: "Eurypterus" },
    ]
  },
  {
    id: 408, name: "Najash rionegrina (Legged Snake)",
    periodName: "Late Cretaceous", periodStart: 95, periodEnd: 90,
    wikiSlug: "Najash_rionegrina",
    lineage: [
      { rank: "Kingdom",   value: "Animalia" },
      { rank: "Phylum",    value: "Chordata" },
      { rank: "Clade",     value: "Vertebrata" },
      { rank: "Clade",     value: "Tetrapoda" },
      { rank: "Clade",     value: "Amniota" },
      { rank: "Clade",     value: "Sauropsida" },
      { rank: "Class",     value: "Reptilia" },
      { rank: "Clade",     value: "Diapsida" },
      { rank: "Order",     value: "Squamata" },
      { rank: "Suborder",  value: "Serpentes" },
      { rank: "Clade",     value: "Ophidia" },
      { rank: "Family",    value: "Najashidae" },
      { rank: "Genus",     value: "Najash" },
    ]
  }
];

// ============================================================
// TAXONOMY HELPERS — work off lineage arrays
// ============================================================

// Find deepest shared node between two species' lineages
function getDeepestShared(a, b) {
  let last = null;
  const bMap = {};
  for (const node of b.lineage) bMap[node.value] = node;
  for (const node of a.lineage) {
    if (bMap[node.value] && bMap[node.value].rank === node.rank) last = node;
    else break;
  }
  return last; // { rank, value } or null
}

// Score: index into lineage a where shared stops (higher = closer)
function getTaxonomyScore(guess, target) {
  const shared = getDeepestShared(guess, target);
  if (!shared) return 0;
  return guess.lineage.findIndex(n => n.value === shared.value && n.rank === shared.rank) + 1;
}

// Max possible score for a species pair
// eslint-disable-next-line no-unused-vars
function getMaxScore(species) {
  return species.lineage.length;
}

// eslint-disable-next-line no-unused-vars
function getTaxonomyLabel(guess, target) {
  const shared = getDeepestShared(guess, target);
  if (!shared) return { label: "No shared group", color: "#b09878" };
  const depth = guess.lineage.findIndex(n => n.value === shared.value);
  const maxDepth = Math.max(guess.lineage.length, target.lineage.length);
  const pct = depth / maxDepth;
  if (pct > 0.85) return { label: `Same ${shared.rank}: ${shared.value}`, color: "#4ade80" };
  if (pct > 0.65) return { label: `Same ${shared.rank}: ${shared.value}`, color: "#86efac" };
  if (pct > 0.45) return { label: `Same ${shared.rank}: ${shared.value}`, color: "#fbbf24" };
  if (pct > 0.25) return { label: `Same ${shared.rank}: ${shared.value}`, color: "#fb923c" };
  return { label: `Same ${shared.rank}: ${shared.value}`, color: "#f87171" };
}

// Returns true if the two species' time ranges overlap at all
function rangesOverlap(a, b) {
  // periodStart = older end (larger Ma), periodEnd = more recent end (smaller Ma)
  return a.periodEnd <= b.periodStart && b.periodEnd <= a.periodStart;
}

// Gap between ranges in Ma (0 if overlapping)
function getTimeDiff(guess, target) {
  if (rangesOverlap(guess, target)) return 0;
  // No overlap: find the gap between the closest edges
  const gOld = guess.periodStart, gNew = guess.periodEnd;
  const tOld = target.periodStart, tNew = target.periodEnd;
  // Gap is from the more-recent edge of the older species to the older edge of the newer one
  return Math.min(
    Math.abs(gNew - tOld),
    Math.abs(tNew - gOld)
  );
}

// Format a Ma value as a human-readable time string
function formatMa(ma) {
  if (ma < 0.0001) return `${Math.round(ma * 1000000)} yrs`;
  if (ma < 0.001)  return `${Math.round(ma * 1000000)} yrs`;
  if (ma < 0.01)   return `${(ma * 1000).toFixed(1)}k yrs`;
  if (ma < 0.1)    return `${Math.round(ma * 1000)}k yrs`;
  if (ma < 1)      return `${(ma * 1000).toFixed(0)}k yrs`;
  if (ma < 5)      return `${ma.toFixed(1)} Ma`;
  return `~${Math.round(ma)} Ma`;
}

function getTimeLabel(guess, target) {
  if (rangesOverlap(guess, target)) {
    const gMid = (guess.periodStart + guess.periodEnd) / 2;
    const tMid = (target.periodStart + target.periodEnd) / 2;
    if (Math.abs(gMid - tMid) < 0.0005)
      return { label: "Same time!", color: "#4ade80" };
    return { label: "Overlapping ranges!", color: "#4ade80" };
  }
  const diff = getTimeDiff(guess, target);
  const str = formatMa(diff);
  if (diff < 0.005) return { label: `${str} apart`, color: "#86efac" };
  if (diff < 5)     return { label: `${str} apart`, color: "#86efac" };
  if (diff < 20)    return { label: `${str} apart`, color: "#fbbf24" };
  if (diff < 100)   return { label: `${str} apart`, color: "#fb923c" };
  return              { label: `${str} apart`, color: "#f87171" };
}

function getTimeArrow(guess, target) {
  if (rangesOverlap(guess, target)) return "✓ Overlapping";
  const gMid = (guess.periodStart + guess.periodEnd) / 2;
  const tMid = (target.periodStart + target.periodEnd) / 2;
  return tMid > gMid ? "Try an older species" : "Try a more recent species";
}

// ============================================================
// DAILY PICK — seeded random, rolls over at 9pm EST (UTC-5 / UTC-4)
// ============================================================
function getDailyPuzzleNumber() {
  // Day 1 started March 4 2026 at 9pm EST = March 5 2026 02:00 UTC
  // Each new puzzle starts at 02:00 UTC (= 9pm EST / 10pm EDT)
  // No offset needed — the 9pm boundary is already expressed in the UTC anchor
  const LAUNCH_MS = Date.UTC(2026, 2, 5, 2, 0, 0); // 2 = March (0-indexed)
  return Math.max(1, Math.floor((Date.now() - LAUNCH_MS) / 86400000) + 1);
}

function seededRandom(seed) {
  // Simple deterministic LCG — same seed always gives same sequence
  let s = seed ^ 0xdeadbeef;
  s = Math.imul(s ^ (s >>> 16), 0x45d9f3b);
  s = Math.imul(s ^ (s >>> 16), 0x45d9f3b);
  s = (s ^ (s >>> 16)) >>> 0;
  return s / 0xffffffff;
}

function getDailySpecies() {
  const dayNum = getDailyPuzzleNumber();
  // Use the day number as seed to pick a random species index
  const idx = Math.floor(seededRandom(dayNum) * SPECIES_DB.length);
  return SPECIES_DB[idx];
}


// ============================================================
// MAIN COMPONENT
// ============================================================
function getPracticeSpecies() {
  // Truly random — uses current timestamp as seed so each call is different
  const idx = Math.floor(seededRandom(Date.now() & 0xffffffff) * SPECIES_DB.length);
  return SPECIES_DB[idx];
}

function puzzleDate(num) {
  const LAUNCH_MS = Date.UTC(2026, 2, 5, 2, 0, 0);
  const d = new Date(LAUNCH_MS + (num - 1) * 86400000);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function HistoryModal({ onClose, history, buildShareTextFromSaved }) {
  const [copiedNum, setCopiedNum] = useState(null);

  function copyHistoryEntry(num, saved) {
    const text = buildShareTextFromSaved(num, saved);
    const finish = () => { setCopiedNum(num); setTimeout(() => setCopiedNum(null), 2500); };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(finish).catch(() => {
          try {
            const ta = document.createElement("textarea");
            ta.value = text; ta.style.cssText = "position:fixed;opacity:0";
            document.body.appendChild(ta); ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
            finish();
          } catch(e) { finish(); }
        });
      } else { finish(); }
    } catch(e) { finish(); }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
        zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#2c1f0e", border: "1px solid rgba(180,120,40,0.4)",
          borderRadius: 16, padding: 24, width: "100%", maxWidth: 420,
          maxHeight: "80vh", overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 16, fontWeight: "bold", color: "#d4a843", letterSpacing: 2, textTransform: "uppercase" }}>
            My History
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "#b09878", fontSize: 20, cursor: "pointer", fontFamily: "inherit" }}
          >✕</button>
        </div>
        {history.length === 0 ? (
          <div style={{ color: "#b09878", fontSize: 14, textAlign: "center", padding: "20px 0" }}>
            No completed puzzles in the last 7 days yet.<br/>
            <span style={{ fontSize: 12, opacity: 0.7 }}>History saves on this device as you play.</span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {history.map(({ num, saved }) => {
              const totalGuesses = saved.guesses.length + (saved.hintsUsed || 0) * 3;
              const MAX = 20;
              const scoreStr = saved.won ? `${totalGuesses}/${MAX}` : `X/${MAX}`;
              const squares = [...saved.guesses].reverse().map(g => g.emoji || "🟥");
              const hintSquares = Array(saved.hintsUsed || 0).fill("⬜");
              const grid = [...squares, ...hintSquares].join("");
              return (
                <div key={num} style={{
                  background: "rgba(90,55,15,0.4)",
                  border: `1px solid ${saved.won ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.3)"}`,
                  borderRadius: 10, padding: "12px 16px",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: "bold", color: saved.won ? "#4ade80" : "#f87171" }}>
                        {saved.won ? "✅" : "❌"} Puzzle #{num}
                        <span style={{ fontSize: 11, color: "#9a7d5a", marginLeft: 8 }}>{puzzleDate(num)}</span>
                      </div>
                      <div style={{ fontSize: 12, color: "#b09878", marginTop: 2 }}>
                        {scoreStr}{saved.hintsUsed > 0 ? ` · ${saved.hintsUsed} hint${saved.hintsUsed > 1 ? "s" : ""}` : ""}
                      </div>
                    </div>
                    <button
                      onClick={() => copyHistoryEntry(num, saved)}
                      style={{
                        background: copiedNum === num ? "rgba(74,222,128,0.2)" : "rgba(140,90,20,0.4)",
                        border: `1px solid ${copiedNum === num ? "rgba(74,222,128,0.5)" : "rgba(180,120,40,0.4)"}`,
                        borderRadius: 12, color: copiedNum === num ? "#4ade80" : "#d4a843",
                        fontSize: 11, padding: "4px 12px", cursor: "pointer", fontFamily: "inherit",
                      }}
                    >
                      {copiedNum === num ? "✅ Copied!" : "📋 Copy"}
                    </button>
                  </div>
                  <div style={{ fontSize: 16, letterSpacing: 1 }}>{grid}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaleoGame() {
  // ── localStorage helpers ──────────────────────────────────────────
  // Key includes puzzle number so saved state auto-invalidates each day
  function getSaveKey(num) { return `paleoguessr_v1_puzzle_${num}`; }

  function loadSavedState(num) {
    try {
      const raw = localStorage.getItem(getSaveKey(num));
      if (!raw) return null;
      const saved = JSON.parse(raw);
      // Re-hydrate guess species references from SPECIES_DB
      const hydratedGuesses = (saved.guesses || []).map(g => {
        const species = SPECIES_DB.find(s => s.id === g.speciesId);
        if (!species) return null;
        return { ...g, species };
      }).filter(Boolean);
      return { ...saved, guesses: hydratedGuesses };
    } catch { return null; }
  }

  function saveState(num, guesses, won, lost, hintsUsed, hintCeiling) {
    try {
      const serialised = {
        guesses: guesses.map(g => ({ ...g, species: undefined, speciesId: g.species.id })),
        won, lost, hintsUsed, hintCeiling,
      };
      localStorage.setItem(getSaveKey(num), JSON.stringify(serialised));
    } catch { /* storage unavailable — silently skip */ }
  }
  // ─────────────────────────────────────────────────────────────────

  // puzzleNumber and dailyTarget are stored in state together so they always
  // stay in sync and can be updated atomically when the day rolls over
  const [puzzleNumber, setPuzzleNumber] = useState(() => getDailyPuzzleNumber());
  const [dailyTarget, setDailyTarget] = useState(() => getDailySpecies());
  const [input, setInput] = useState("");

  // Initialise daily state from localStorage if available
  const [guesses, setGuesses] = useState(() => {
    const saved = loadSavedState(getDailyPuzzleNumber());
    return saved ? saved.guesses : [];
  });
  const [won, setWon] = useState(() => {
    const saved = loadSavedState(getDailyPuzzleNumber());
    return saved ? saved.won : false;
  });
  const [lost, setLost] = useState(() => {
    const saved = loadSavedState(getDailyPuzzleNumber());
    return saved ? saved.lost : false;
  });
  const [hintsUsed, setHintsUsed] = useState(() => {
    const saved = loadSavedState(getDailyPuzzleNumber());
    return saved ? saved.hintsUsed : 0;
  });
  const [hintCeiling, setHintCeiling] = useState(() => {
    const saved = loadSavedState(getDailyPuzzleNumber());
    return saved ? saved.hintCeiling : 0;
  });

  const [suggestions, setSuggestions] = useState([]);
  const [showSpeciesList, setShowSpeciesList] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);
  const [practiceTarget, setPracticeTarget] = useState(null);
  const [dailySnapshot, setDailySnapshot] = useState(null);

  // Check every 30 seconds whether the day has rolled over.
  // When it has, update the puzzle and reset daily game state.
  useEffect(() => {
    const tick = () => {
      const newNum = getDailyPuzzleNumber();
      setPuzzleNumber(prev => {
        if (newNum !== prev) {
          // New day — reset daily game and load new target
          setDailyTarget(getDailySpecies());
          setGuesses([]);
          setWon(false);
          setLost(false);
          setHintsUsed(0);
          setHintCeiling(0);
          setInput("");
          setSuggestions([]);
          setDailySnapshot(null);
          return newNum;
        }
        return prev;
      });
    };
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  // Save daily state to localStorage whenever it changes (not in practice mode)
  useEffect(() => {
    if (!practiceMode) {
      saveState(puzzleNumber, guesses, won, lost, hintsUsed, hintCeiling);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guesses, won, lost, hintsUsed, hintCeiling, practiceMode, puzzleNumber]);

  const MAX_GUESSES = 20;
  const HINT_COST = 3;
  const guessCount = guesses.length + hintsUsed * HINT_COST;
  const guessesLeft = MAX_GUESSES - guessCount;

  // Effective target depends on mode
  const target = practiceMode ? (practiceTarget || dailyTarget) : dailyTarget;

  function enterPractice() {
    // Save daily state so returning restores exactly where we left off
    setDailySnapshot({ guesses, won, lost, hintsUsed, hintCeiling });
    setPracticeMode(true);
    setPracticeTarget(getPracticeSpecies());
    setGuesses([]);
    setWon(false);
    setLost(false);
    setHintsUsed(0);
    setHintCeiling(0);
    setInput("");
    setSuggestions([]);
  }

  function returnToDaily() {
    setPracticeMode(false);
    setPracticeTarget(null);
    setInput("");
    setSuggestions([]);
    if (dailySnapshot) {
      setGuesses(dailySnapshot.guesses);
      setWon(dailySnapshot.won);
      setLost(dailySnapshot.lost);
      setHintsUsed(dailySnapshot.hintsUsed);
      setHintCeiling(dailySnapshot.hintCeiling);
      setDailySnapshot(null);
    }
  }

  function buildShareText(didWin) {
    const MAX = 20;
    const scoreStr = didWin ? `${guessCount}/${MAX}` : `X/${MAX}`;
    const hintStr = hintsUsed > 0 ? ` (${hintsUsed} hint${hintsUsed > 1 ? "s" : ""})` : "";
    // Emoji grid: one square per guess, gold for correct, color-coded by taxonomy closeness
    const squares = [...guesses].reverse().map(g => {
      if (g.correct) return "🟩";
      const score = getTaxonomyScore(g.species, target);
      const max = Math.max(g.species.lineage.length, target.lineage.length);
      const pct = score / max;
      if (pct > 0.75) return "🟨";
      if (pct > 0.45) return "🟧";
      return "🟥";
    });
    // Pad hint slots as grey squares
    const hintSquares = Array(hintsUsed).fill("⬜");
    const grid = [...squares, ...hintSquares].join("");
    return [
      `🦕 Paleoguessr #${puzzleNumber}`,
      `${scoreStr}${hintStr}`,
      grid,
      "https://paleoguessr.com"
    ].join("\n");
  }

  // Build share text from a saved history entry (no live state needed)
  function buildShareTextFromSaved(num, saved) {
    const MAX = 20;
    const totalGuesses = saved.guesses.length + saved.hintsUsed * 3;
    const scoreStr = saved.won ? `${totalGuesses}/${MAX}` : `X/${MAX}`;
    const hintStr = saved.hintsUsed > 0 ? ` (${saved.hintsUsed} hint${saved.hintsUsed > 1 ? "s" : ""})` : "";
    // Rebuild emoji grid from stored emoji values
    const squares = [...saved.guesses].reverse().map(g => g.emoji || "🟥");
    const hintSquares = Array(saved.hintsUsed).fill("⬜");
    const grid = [...squares, ...hintSquares].join("");
    return [
      `🦕 Paleoguessr #${num}`,
      `${scoreStr}${hintStr}`,
      grid,
      "https://paleoguessr.com"
    ].join("\n");
  }

  // Load last 7 completed puzzles (excluding today)
  function getHistory() {
    const history = [];
    for (let i = 1; i <= 7; i++) {
      const num = puzzleNumber - i;
      if (num < 1) break;
      try {
        const raw = localStorage.getItem(getSaveKey(num));
        if (!raw) continue;
        const saved = JSON.parse(raw);
        if (!saved.won && !saved.lost) continue; // incomplete — skip
        history.push({ num, saved });
      } catch { continue; }
    }
    return history;
  }

  function copyResult() {
    const text = buildShareText(won);
    const finish = () => { setCopied(true); setTimeout(() => setCopied(false), 2500); };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(finish).catch(() => {
          try {
            const ta = document.createElement("textarea");
            ta.value = text; ta.style.cssText = "position:fixed;opacity:0";
            document.body.appendChild(ta); ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
            finish();
          } catch(e) { finish(); } // show Copied! even if clipboard blocked
        });
      } else {
        finish(); // sandbox blocked clipboard entirely — just show feedback
      }
    } catch(e) { finish(); }
  }

  const remaining = SPECIES_DB.filter(
    s => !guesses.find(g => g.species.id === s.id)
  );

  function handleInput(val) {
    setInput(val);
    if (val.length < 2) { setSuggestions([]); return; }
    const matches = remaining.filter(s =>
      s.name.toLowerCase().includes(val.toLowerCase())
    );
    setSuggestions(matches.slice(0, 6));
  }

  function makeGuess(species) {
    if (guesses.find(g => g.species.id === species.id)) return;
    if (won || lost) return;
    const taxScore = getTaxonomyScore(species, target);
    const timeDiff = getTimeDiff(species, target);
    const correct = species.id === target.id;
    // Store emoji square now while we have the target — used for history replay
    let emoji = "🟥";
    if (correct) { emoji = "🟩"; }
    else {
      const max = Math.max(species.lineage.length, target.lineage.length);
      const pct = taxScore / max;
      if (pct > 0.75) emoji = "🟨";
      else if (pct > 0.45) emoji = "🟧";
    }
    const newGuess = { species, taxScore, timeDiff, correct, emoji };
    const newGuesses = [newGuess, ...guesses];
    setGuesses(newGuesses);
    if (correct) {
      setWon(true);
    } else {
      const newCount = newGuesses.length + hintsUsed * HINT_COST;
      if (newCount >= MAX_GUESSES) setLost(true);
    }
    setInput("");
    setSuggestions([]);
  }

  function useHint() {
    if (won || lost) return;
    if (guessCount + HINT_COST > MAX_GUESSES) return;
    // Lock in an absolute depth ceiling at the moment hint is clicked.
    // This means getting closer guesses later won't retroactively extend the reveal.
    const guessedSpecies = guesses.map(g => g.species);
    let bestSharedDepth = 0;
    for (const gs of guessedSpecies) {
      let d = 0;
      for (let i = 0; i < Math.min(gs.lineage.length, target.lineage.length); i++) {
        if (gs.lineage[i].value === target.lineage[i].value &&
            gs.lineage[i].rank === target.lineage[i].rank) d++;
        else break;
      }
      if (d > bestSharedDepth) bestSharedDepth = d;
    }
    const guessReveal = Math.min(bestSharedDepth + 1, target.lineage.length);
    const newCeiling = Math.min(
      Math.max(hintCeiling + 1, guessReveal + 1),
      target.lineage.length
    );
    setHintCeiling(newCeiling);
    setHintsUsed(prev => {
      const next = prev + 1;
      const newCount = guesses.length + next * HINT_COST;
      if (newCount >= MAX_GUESSES) setLost(true);
      return next;
    });
  }

  const bestGuess = guesses.length > 0
    ? guesses.reduce((best, g) => g.taxScore > best.taxScore ? g : best, guesses[0])
    : null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#2c1f0e",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: "#f0e6d0",
      padding: "0 0 80px 0",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Subtle fossil footprint background pattern */}
      <svg style={{
        position: "fixed", inset: 0, width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 0, opacity: 0.045,
      }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="footprints" x="0" y="0" width="180" height="180" patternUnits="userSpaceOnUse">
            {/* Theropod footprint — three forward toes */}
            <g transform="translate(30,30) rotate(-20)" fill="#c8a060">
              <ellipse cx="0" cy="0" rx="7" ry="10"/>
              <ellipse cx="-9" cy="-14" rx="4" ry="8" transform="rotate(-25,−9,−14)"/>
              <ellipse cx="0" cy="-17" rx="4" ry="8"/>
              <ellipse cx="9" cy="-14" rx="4" ry="8" transform="rotate(25,9,−14)"/>
            </g>
            {/* Second footprint offset — staggered stride */}
            <g transform="translate(110,105) rotate(15)" fill="#c8a060">
              <ellipse cx="0" cy="0" rx="7" ry="10"/>
              <ellipse cx="-9" cy="-14" rx="4" ry="8" transform="rotate(-25,−9,−14)"/>
              <ellipse cx="0" cy="-17" rx="4" ry="8"/>
              <ellipse cx="9" cy="-14" rx="4" ry="8" transform="rotate(25,9,−14)"/>
            </g>
            {/* Small mammal pawprint */}
            <g transform="translate(140,40)" fill="#c8a060">
              <ellipse cx="0" cy="0" rx="5" ry="6"/>
              <circle cx="-6" cy="-7" r="2.5"/>
              <circle cx="0" cy="-9" r="2.5"/>
              <circle cx="6" cy="-7" r="2.5"/>
              <circle cx="-4" cy="5" r="2"/>
              <circle cx="4" cy="5" r="2"/>
            </g>
            {/* Sauropod round print */}
            <g transform="translate(60,130)" fill="#c8a060">
              <ellipse cx="0" cy="0" rx="11" ry="9"/>
              <ellipse cx="-8" cy="-6" rx="3" ry="4"/>
              <ellipse cx="-3" cy="-10" rx="3" ry="4"/>
              <ellipse cx="4" cy="-10" rx="3" ry="4"/>
              <ellipse cx="9" cy="-6" rx="3" ry="4"/>
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#footprints)"/>
      </svg>
      <div style={{ position: "relative", zIndex: 1 }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(180deg, rgba(120,75,20,0.5) 0%, transparent 100%)",
        borderBottom: "1px solid rgba(160,100,30,0.5)",
        padding: "28px 20px 20px",
        textAlign: "center"
      }}>
        <h1 style={{
          fontSize: "clamp(28px, 6vw, 48px)",
          fontWeight: "bold",
          margin: 0,
          background: "linear-gradient(135deg, #d4a843 0%, #f0c060 50%, #b47828 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: 2
        }}>
          PALEOGUESSR
        </h1>
        <div style={{ fontSize: 13, color: "#b09878", marginTop: 6 }}>
          {practiceMode
            ? <span style={{ color: "#f0c060" }}>Practice Mode — no stakes, just fun!</span>
            : <span style={{ color: "#b89060" }}>Puzzle <strong style={{ color: "#e8b84b" }}>#{puzzleNumber}</strong> • {SPECIES_DB.length} species in database</span>
          }
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
          <button
            onClick={() => setShowSpeciesList(true)}
            style={{
              background: "rgba(140,90,20,0.4)",
              border: "1px solid rgba(180,120,40,0.4)",
              borderRadius: 20,
              color: "#d4a843",
              fontSize: 12,
              padding: "6px 16px",
              cursor: "pointer",
              letterSpacing: 1,
              fontFamily: "inherit"
            }}
          >
            View All Species
          </button>
          <button
            onClick={() => setShowHistory(true)}
            style={{
              background: "rgba(140,90,20,0.4)",
              border: "1px solid rgba(180,120,40,0.4)",
              borderRadius: 20,
              color: "#d4a843",
              fontSize: 12,
              padding: "6px 16px",
              cursor: "pointer",
              letterSpacing: 1,
              fontFamily: "inherit"
            }}
          >
            My History
          </button>
          {practiceMode ? (
            <button
              onClick={returnToDaily}
              style={{
                background: "rgba(140,90,20,0.3)",
                border: "1px solid rgba(160,100,25,0.7)",
                borderRadius: 20,
                color: "#e8b84b",
                fontSize: 12,
                padding: "6px 16px",
                cursor: "pointer",
                letterSpacing: 1,
                fontFamily: "inherit"
              }}
            >
              Back to Daily
            </button>
          ) : (
            <button
              onClick={enterPractice}
              style={{
                background: "rgba(74,222,128,0.12)",
                border: "1px solid rgba(74,222,128,0.35)",
                borderRadius: 20,
                color: "#4ade80",
                fontSize: 12,
                padding: "6px 16px",
                cursor: "pointer",
                letterSpacing: 1,
                fontFamily: "inherit"
              }}
            >
              Practice
            </button>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px" }}>

        {/* Win Banner */}
        {won && (
          <div style={{
            margin: "24px 0 0",
            padding: "20px 20px 16px",
            background: "linear-gradient(135deg, rgba(74,222,128,0.2), rgba(16,185,129,0.1))",
            border: "1px solid rgba(74,222,128,0.4)",
            borderRadius: 12,
            textAlign: "center"
          }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🦕</div>
            <div style={{ fontSize: 20, fontWeight: "bold", color: "#4ade80" }}>
              Excellent fossil find!
            </div>
            <div style={{ fontSize: 15, color: "#86efac", marginTop: 4 }}>
              You identified <strong>{target.name}</strong> in{" "}
              <strong>{guessCount}</strong> guess{guessCount !== 1 ? "es" : ""}
              {hintsUsed > 0 && <span style={{ color: "#fbbf24" }}> ({hintsUsed} hint{hintsUsed > 1 ? "s" : ""})</span>}!
            </div>
            {!practiceMode && <div style={{ fontSize: 12, color: "#4ade8077", marginTop: 2 }}>
              Paleoguessr #{puzzleNumber}
            </div>}
            {!practiceMode && <button
              onClick={copyResult}
              style={{
                marginTop: 14,
                background: copied ? "rgba(74,222,128,0.25)" : "rgba(74,222,128,0.12)",
                border: `1px solid ${copied ? "rgba(74,222,128,0.7)" : "rgba(74,222,128,0.35)"}`,
                borderRadius: 8,
                color: copied ? "#4ade80" : "#86efac",
                fontSize: 14,
                padding: "9px 22px",
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: "bold",
                letterSpacing: 0.5,
                transition: "all 0.2s",
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              {copied ? "✅ Copied!" : "📋 Copy Result"}
            </button>}
            {practiceMode && <button
              onClick={enterPractice}
              style={{
                marginTop: 14,
                background: "rgba(251,191,36,0.12)",
                border: "1px solid rgba(251,191,36,0.4)",
                borderRadius: 8,
                color: "#fbbf24",
                fontSize: 14,
                padding: "9px 22px",
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: "bold",
                letterSpacing: 0.5,
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              🔀 New Practice Puzzle
            </button>}
          </div>
        )}

        {/* Loss Banner */}
        {lost && !won && (
          <div style={{
            margin: "24px 0 0",
            padding: "20px 20px 16px",
            background: "linear-gradient(135deg, rgba(248,113,113,0.2), rgba(239,68,68,0.1))",
            border: "1px solid rgba(248,113,113,0.4)",
            borderRadius: 12,
            textAlign: "center"
          }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🦴</div>
            <div style={{ fontSize: 20, fontWeight: "bold", color: "#f87171" }}>
              Extinction Event!
            </div>
            <div style={{ fontSize: 15, color: "#fca5a5", marginTop: 4 }}>
              The mystery species was <strong>{target.name}</strong>.{" "}
              {practiceMode ? "Keep practicing!" : "Try again tomorrow!"}
            </div>
            {!practiceMode && <div style={{ fontSize: 12, color: "#f8717144", marginTop: 2 }}>
              Paleoguessr #{puzzleNumber}
            </div>}
            {!practiceMode && <button
              onClick={copyResult}
              style={{
                marginTop: 14,
                background: copied ? "rgba(248,113,113,0.25)" : "rgba(248,113,113,0.1)",
                border: `1px solid ${copied ? "rgba(248,113,113,0.7)" : "rgba(248,113,113,0.3)"}`,
                borderRadius: 8,
                color: copied ? "#f87171" : "#fca5a5",
                fontSize: 14,
                padding: "9px 22px",
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: "bold",
                letterSpacing: 0.5,
                transition: "all 0.2s",
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              {copied ? "✅ Copied!" : "📋 Copy Result"}
            </button>}
            {practiceMode && <button
              onClick={enterPractice}
              style={{
                marginTop: 14,
                background: "rgba(251,191,36,0.12)",
                border: "1px solid rgba(251,191,36,0.4)",
                borderRadius: 8,
                color: "#fbbf24",
                fontSize: 14,
                padding: "9px 22px",
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: "bold",
                letterSpacing: 0.5,
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              🔀 New Practice Puzzle
            </button>}
          </div>
        )}

        {/* Search */}
        {!won && !lost && (
          <div style={{ marginTop: 24, position: "relative" }}>
            <div style={{ position: "relative" }}>
              <input
                value={input}
                onChange={e => handleInput(e.target.value)}
                placeholder="Type a prehistoric species name..."
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  background: "rgba(100,60,15,0.4)",
                  border: "1px solid rgba(180,120,40,0.4)",
                  borderRadius: 10,
                  color: "#f0e6d0",
                  fontSize: 16,
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "inherit"
                }}
              />
            </div>
            {suggestions.length > 0 && (
              <div style={{
                position: "absolute", top: "100%", left: 0, right: 0,
                background: "#241508",
                border: "1px solid rgba(180,120,40,0.4)",
                borderTop: "none",
                borderRadius: "0 0 10px 10px",
                zIndex: 100,
                overflow: "hidden"
              }}>
                {suggestions.map(s => (
                  <div
                    key={s.id}
                    onMouseDown={e => { e.preventDefault(); makeGuess(s); }}
                    onClick={() => makeGuess(s)}
                    style={{
                      padding: "12px 18px",
                      cursor: "pointer",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      transition: "background 0.15s",
                      WebkitTapHighlightColor: "rgba(140,90,20,0.5)",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(140,90,20,0.4)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <span style={{ fontWeight: "bold" }}>{s.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Clues box — shown before first guess, includes hint button */}
        {!won && !lost && guesses.length === 0 && hintsUsed === 0 && (
          <div style={{
            marginTop: 20,
            padding: "16px 20px",
            background: "rgba(140,90,20,0.3)",
            border: "1px solid rgba(180,120,40,0.2)",
            borderRadius: 10,
            fontSize: 14,
            color: "#b09878",
            lineHeight: 1.7
          }}>
            <strong style={{ color: "#d4a843" }}>How to play:</strong> Search for a prehistoric species. Each guess shows you:
            <br />🧬 <strong>Taxonomic closeness</strong> — how related the species are (phylum → genus)
            <br />⏳ <strong>Time distance</strong> — how many million years apart they lived
            <br />Use both clues to zero in on the mystery species!
            <div style={{ marginTop: 14, borderTop: "1px solid rgba(180,120,40,0.15)", paddingTop: 12 }}>
              <button
                onClick={useHint}
                disabled={guessCount + HINT_COST > MAX_GUESSES}
                title="Reveals the next cladogram level of ???. Costs 3 guesses."
                style={{
                  background: "rgba(251,191,36,0.1)",
                  border: "1px solid rgba(251,191,36,0.35)",
                  borderRadius: 8,
                  color: "#fbbf24",
                  fontSize: 13,
                  padding: "8px 16px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                🔍 Hint <span style={{ fontSize: 11, opacity: 0.8 }}>(−3 guesses)</span>
              </button>
            </div>
          </div>
        )}

        {/* Guess list — sorted closest time first */}
        {guesses.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
              <div style={{ fontSize: 12, letterSpacing: 3, color: "#b47828", textTransform: "uppercase" }}>
                Your Guesses
              </div>
              <div style={{ textAlign: "right", lineHeight: 1.2 }}>
                <div style={{ fontSize: 18, fontWeight: "bold", color: lost ? "#f87171" : won ? "#4ade80" : guessesLeft <= 3 ? "#f87171" : "#d4a843" }}>
                  {guessCount}<span style={{ fontSize: 12, color: "#7a6040" }}>/20</span>
                </div>
                {hintsUsed > 0 && <div style={{ fontSize: 10, color: "#fb923c" }}>({hintsUsed} hint{hintsUsed > 1 ? "s" : ""} used)</div>}
              </div>
            </div>
            {/* Hint button — separated from search, lives below the guess counter */}
            {!won && !lost && (
              <div style={{ marginBottom: 16 }}>
                <button
                  onClick={useHint}
                  disabled={guessCount + HINT_COST > MAX_GUESSES}
                  title="Reveals the next cladogram level of ???. Costs 3 guesses."
                  style={{
                    background: guessCount + HINT_COST > MAX_GUESSES ? "rgba(90,55,15,0.4)" : "rgba(251,191,36,0.12)",
                    border: `1px solid ${guessCount + HINT_COST > MAX_GUESSES ? "rgba(160,100,30,0.3)" : "rgba(251,191,36,0.4)"}`,
                    borderRadius: 8,
                    color: guessCount + HINT_COST > MAX_GUESSES ? "#7a6040" : "#fbbf24",
                    fontSize: 13,
                    padding: "8px 16px",
                    cursor: guessCount + HINT_COST > MAX_GUESSES ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  🔍 Hint <span style={{ fontSize: 11, opacity: 0.8 }}>(−3 guesses)</span>
                  {hintsUsed > 0 && <span style={{ fontSize: 11, color: "#fb923c" }}>×{hintsUsed} used</span>}
                </button>
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[...guesses].sort((a, b) => a.timeDiff - b.timeDiff).map((g, i) => {
                const timeInfo = getTimeLabel(g.species, target);
                const arrow = getTimeArrow(g.species, target);
                return (
                  <div key={g.species.id} style={{
                    background: g.correct
                      ? "linear-gradient(135deg, rgba(74,222,128,0.15), rgba(16,185,129,0.08))"
                      : "rgba(90,55,15,0.4)",
                    border: `1px solid ${g.correct ? "rgba(74,222,128,0.4)" : "rgba(160,100,30,0.25)"}`,
                    borderRadius: 8,
                    padding: "10px 14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{
                        fontSize: 11, color: "#7a6040", width: 16, textAlign: "right", flexShrink: 0
                      }}>{i + 1}.</span>
                      <div style={{ fontWeight: "bold", fontSize: 14, color: g.correct ? "#4ade80" : "#f0e6d0" }}>
                        {g.correct ? "✅ " : ""}{g.species.name}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: "bold", color: timeInfo.color }}>
                        {g.correct ? "✓ Match!" : timeInfo.label}
                      </div>
                      {!g.correct && (
                        <div style={{ fontSize: 11, color: "#9a7d5a", marginTop: 1 }}>{arrow}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Taxonomy Tree */}
        {(guesses.length > 0 || hintsUsed > 0) && (
          <div style={{ marginTop: 32 }}>
            <div style={{ fontSize: 12, letterSpacing: 3, color: "#b47828", marginBottom: 14, textTransform: "uppercase" }}>
              Cladogram
            </div>
            <TaxonomyTree guesses={guesses} target={target} won={won} hintsUsed={hintsUsed} hintCeiling={hintCeiling} />
          </div>
        )}


        {/* Wikipedia card */}
        {(guesses.length > 0 || hintsUsed > 0) && (
          <WikiCard bestGuess={bestGuess?.species} target={target} won={won || lost} />
        )}

      </div>

      </div>{/* end relative zIndex wrapper */}

      {/* History Modal */}
      {showHistory && (
        <HistoryModal
          onClose={() => setShowHistory(false)}
          history={getHistory()}
          buildShareTextFromSaved={buildShareTextFromSaved}
        />
      )}

      {/* Species List Modal */}}
      {showSpeciesList && (
        <div
          onClick={() => setShowSpeciesList(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.75)",
            zIndex: 200,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#241508",
              border: "1px solid rgba(180,120,40,0.4)",
              borderRadius: 14,
              padding: "24px",
              maxWidth: 600,
              width: "100%",
              maxHeight: "80vh",
              overflowY: "auto"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 11, letterSpacing: 4, color: "#b47828", textTransform: "uppercase" }}>Database</div>
                <div style={{ fontSize: 20, fontWeight: "bold", color: "#d4a843" }}>All {SPECIES_DB.length} Species</div>
              </div>
              <button
                onClick={() => setShowSpeciesList(false)}
                style={{
                  background: "rgba(100,60,15,0.4)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "#b09878", borderRadius: 8, padding: "6px 12px",
                  cursor: "pointer", fontSize: 13, fontFamily: "inherit"
                }}
              >✕ Close</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[...SPECIES_DB].sort((a, b) => b.periodStart - a.periodStart).map(s => (
                <div key={s.id} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 14px",
                  background: "rgba(90,55,15,0.4)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 8
                }}>
                  <div>
                    <div style={{ fontWeight: "bold", fontSize: 15 }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: "#9a7d5a" }}>{s.lineage.find(n => n.rank === "Clade" || n.rank === "Order")?.value || s.lineage[2]?.value}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, color: "#d4a843" }}>{s.periodName}</div>
                    <div style={{ fontSize: 11, color: "#7a6040" }}>{s.periodEnd}–{s.periodStart} Ma</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// CLADOGRAM BUILD — uses lineage arrays directly
// ============================================================

function buildCladogram(speciesList) {
  // Each species path = its lineage nodes + a terminal Species leaf
  function getPath(s) {
    return [
      ...s.lineage.map(n => ({ rank: n.rank, value: n.value, species: null, isHintNode: n.isHintNode || false })),
      { rank: "Species", value: s.name.replace(/\s*\([^)]*\)/, ""), species: s, isHintNode: false }
    ];
  }
  const paths = speciesList.map(getPath);

  function groupAt(paths, depth) {
    if (paths.length === 0) return [];
    // Check if all paths are exhausted at this depth
    const alive = paths.filter(p => depth < p.length);
    if (alive.length === 0) return [];
    const groups = {};
    for (const path of alive) {
      const node = path[depth];
      const key = `${node.rank}::${node.value}`;
      if (!groups[key]) groups[key] = { node, paths: [] };
      groups[key].paths.push(path);
    }
    return Object.values(groups).map(({ node, paths: grpPaths }) => {
      const isLeaf = node.rank === "Species";
      return {
        rank: node.rank,
        value: node.value,
        species: isLeaf ? node.species : null,
        isHintNode: node.isHintNode || false,
        children: isLeaf ? [] : groupAt(grpPaths, depth + 1),
      };
    });
  }

  const roots = groupAt(paths, 0);
  if (roots.length === 1) return roots[0];
  return { rank: "Root", value: "Life", species: null, children: roots };
}

// Collapse single-child internal nodes — keep only branching points and leaves
// Exception: never collapse hint-flagged nodes (they are deliberately revealed)
function pruneLinear(node) {
  if (!node.children || node.children.length === 0) return node;
  const kids = node.children.map(pruneLinear);
  const isHint = node.isHintNode;
  // Keep if: root, species leaf, multiple children, or hint-flagged
  if (kids.length === 1 && node.rank !== "Root" && node.rank !== "Species" && !isHint) return kids[0];
  return { ...node, children: kids };
}

function getSharedGroupWiki(bestGuess, target) {
  if (!bestGuess || !target) return null;
  const shared = getDeepestShared(bestGuess, target);
  return shared || { rank: "Kingdom", value: "Animalia" };
}

// ============================================================
// SVG CLADOGRAM TREE
// ============================================================
const RANK_COLORS = {
  Root: "#b09878", Kingdom: "#d4a843", Phylum: "#c8964a",
  Class: "#b47828", Order: "#e0a030", Clade: "#f0c060",
  Superfamily: "#a3e635", Family: "#86efac", Subfamily: "#6ee7b7",
  Genus: "#4ade80", Species: "#f0e6d0",
};

// Compute layout: assign x (depth) and y (vertical position) to each node
function layoutTree(node) {
  // Assign depths and collect leaves
  const nodes = [];
  let leafIndex = 0;

  function traverse(n, depth) {
    const id = nodes.length;
    const entry = { ...n, id, depth, y: null, children: [] };
    nodes.push(entry);
    if (n.children && n.children.length > 0) {
      const childIds = n.children.map(c => {
        const cid = traverse(c, depth + 1);
        return cid;
      });
      entry.children = childIds;
    } else {
      entry.leafIndex = leafIndex++;
    }
    return id;
  }

  traverse(node, 0);

  // Assign y to leaves first
  const leaves = nodes.filter(n => n.children.length === 0);
  const leafSpacing = 44;
  leaves.forEach((n, i) => { n.y = i * leafSpacing; });

  // Assign y to internals as midpoint of children
  function assignY(id) {
    const n = nodes[id];
    if (n.children.length === 0) return n.y;
    const ys = n.children.map(cid => assignY(cid));
    n.y = (Math.min(...ys) + Math.max(...ys)) / 2;
    return n.y;
  }
  assignY(0);

  const maxDepth = Math.max(...nodes.map(n => n.depth));
  return { nodes, maxDepth, totalHeight: Math.max(leaves.length * leafSpacing, 60) };
}

function TaxonomyTree({ guesses, target, won, hintsUsed = 0, hintCeiling = 0 }) {
  const guessedSpecies = guesses.map(g => g.species);

  // How many lineage levels are already revealed by the best guess?
  let bestSharedDepth = 0;
  for (const gs of guessedSpecies) {
    let d = 0;
    for (let i = 0; i < Math.min(gs.lineage.length, target.lineage.length); i++) {
      if (gs.lineage[i].value === target.lineage[i].value &&
          gs.lineage[i].rank === target.lineage[i].rank) d++;
      else break;
    }
    if (d > bestSharedDepth) bestSharedDepth = d;
  }

  // guessRevealDepth: one beyond the shared prefix so ??? branches visibly off the tree
  // hintCeiling: absolute depth locked in when hint was clicked — never drifts upward
  // when guesses get closer, keeping hints honest
  const guessRevealDepth = guessedSpecies.length === 0 && hintsUsed === 0
    ? 1
    : Math.min(bestSharedDepth + 1, target.lineage.length);
  const revealDepth = Math.max(guessRevealDepth, hintCeiling);

  let mysteryLineage;
  if (won) {
    mysteryLineage = target.lineage;
  } else {
    // Nodes up to guessRevealDepth are normal; nodes beyond that (hint-only) get flagged
    // so pruneLinear won't collapse them
    mysteryLineage = target.lineage.slice(0, revealDepth).map((node, i) => ({
      ...node,
      isHintNode: i >= guessRevealDepth
    }));
  }

  const mystery = {
    id: -1, name: "???",
    periodName: "???", periodStart: 0, periodEnd: 0,
    wikiSlug: "", lineage: mysteryLineage
  };

  const allSpecies = won
    ? guessedSpecies
    : [...guessedSpecies, mystery];

  const raw = buildCladogram(allSpecies);
  const pruned = pruneLinear(raw);
  const { nodes, maxDepth, totalHeight } = layoutTree(pruned);

  const colWidth = 120;
  const leafW = 100;
  const nodeW = 80;
  const nodeH = 28;
  const svgWidth = (maxDepth + 1) * colWidth + leafW + 20;
  const svgHeight = totalHeight + 50;
  const xOf = depth => depth * colWidth + 10;

  return (
    <div style={{
      background: "rgba(90,55,15,0.35)",
      border: "1px solid rgba(160,100,30,0.4)",
      borderRadius: 10,
      padding: "16px 8px 12px",
      overflowX: "auto",
    }}>
      <svg width={svgWidth} height={svgHeight} style={{ display: "block", minWidth: svgWidth }}>
        {/* Edges */}
        {nodes.map(n => {
          if (!n.children || n.children.length === 0) return null;
          const px = xOf(n.depth) + nodeW;
          const py = n.y + nodeH / 2;
          return n.children.map(cid => {
            const c = nodes[cid];
            const cx = xOf(c.depth);
            const cy = c.y + nodeH / 2;
            return (
              <path
                key={`edge-${n.id}-${cid}`}
                d={`M ${px} ${py} H ${(px + cx) / 2} V ${cy} H ${cx}`}
                fill="none"
                stroke="rgba(200,160,80,0.25)"
                strokeWidth={1.5}
              />
            );
          });
        })}

        {/* Nodes */}
        {nodes.map(n => {
          const isLeaf = !n.children || n.children.length === 0;
          const isMystery = n.value === "???";
          const isWinner = won && n.species && n.species.id === target.id;
          const isHintRevealed = n.isHintNode;
          const color = isWinner ? "#4ade80" : isMystery ? "#f87171" : isHintRevealed ? "#fbbf24" : (RANK_COLORS[n.rank] || "#b09878");
          const w = isLeaf ? leafW : nodeW;
          const x = xOf(n.depth);
          const y = n.y;
          const displayValue = n.value.replace(/\s*\([^)]*\)/, "");
          const label = displayValue.length > 13 ? displayValue.slice(0, 12) + "…" : displayValue;

          return (
            <g key={`node-${n.id}`}>
              <rect
                x={x} y={y} width={w} height={nodeH}
                rx={isLeaf ? 6 : 12}
                fill={`${color}15`}
                stroke={color + (isMystery ? "cc" : n.isHintNode ? "aa" : "55")}
                strokeWidth={isMystery ? 1.5 : n.isHintNode ? 1.5 : 1}
                strokeDasharray={isMystery ? "4 2" : n.isHintNode ? "3 2" : "none"}
              />
              <text
                x={x + w / 2} y={y + nodeH / 2 + 4}
                textAnchor="middle"
                fontSize={isLeaf ? 10 : 9}
                fontWeight={isLeaf ? "bold" : "normal"}
                fill={isMystery ? "#f87171" : isWinner ? "#4ade80" : "#f0e6d0"}
                fontFamily="Georgia, serif"
              >
                {isMystery ? "???" : isWinner ? `🏆 ${label}` : label}
              </text>
            </g>
          );
        })}
      </svg>

      <div style={{ marginTop: 8, fontSize: 11, color: "#7a6040", display: "flex", gap: 16, flexWrap: "wrap", paddingLeft: 8 }}>
        <span style={{ color: "#c8a878" }}><span style={{ color: "#f87171" }}>???</span> = Mystery species (branches as you narrow it down)</span>
        {won && <span><span style={{ color: "#4ade80" }}>🏆</span> = Correct!</span>}
      </div>
    </div>
  );
}

// ============================================================
// CLOSEST TIME SUMMARY (Globle-style)
// ============================================================
// eslint-disable-next-line no-unused-vars
function ClosestTimeSummary({ guesses, target }) {
  const closest = [...guesses].sort((a, b) => a.timeDiff - b.timeDiff)[0];
  if (!closest) return null;
  const diff = closest.timeDiff;
  const overlaps = rangesOverlap(closest.species, target);
  const arrow = getTimeArrow(closest.species, target);

  let heat, label;
  if (overlaps)          { heat = "#4ade80"; label = "Overlapping time ranges!"; }
  else if (diff < 0.001) { heat = "#4ade80"; label = "Extremely close in time!"; }
  else if (diff < 15)    { heat = "#86efac"; label = "Very close in time"; }
  else if (diff < 50)    { heat = "#fbbf24"; label = "Somewhat close"; }
  else if (diff < 150)   { heat = "#fb923c"; label = "Far apart in time"; }
  else                   { heat = "#f87171"; label = "Very far apart in time"; }

  return (
    <div style={{
      marginTop: 20,
      padding: "14px 18px",
      background: `${heat}12`,
      border: `1px solid ${heat}44`,
      borderRadius: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 8
    }}>
      <div>
        <div style={{ fontSize: 11, color: "#9a7d5a", textTransform: "uppercase", letterSpacing: 2, marginBottom: 2 }}>
          Best Time Match
        </div>
        <div style={{ fontSize: 14, fontWeight: "bold", color: "#f0e6d0" }}>
          {closest.species.name}
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 18, fontWeight: "bold", color: heat }}>
          {overlaps ? "Overlap!" : formatMa(diff)}
        </div>
        <div style={{ fontSize: 11, color: heat + "cc" }}>{label} • {arrow}</div>
      </div>
    </div>
  );
}

// ============================================================
// WIKIPEDIA CARD — live fetch of summary + image
// ============================================================
function WikiCard({ bestGuess, target, won }) {
  const [wikiData, setWikiData] = useState(null);
  const [loading, setLoading] = useState(false);

  const shared = won
    ? { rank: "Species", value: target.wikiSlug, display: target.name }
    : bestGuess
      ? (() => {
          const s = getSharedGroupWiki(bestGuess, target);
          return s ? { rank: s.rank, value: s.value, display: s.value } : null;
        })()
      : null;

  const wikiTitle = won ? target.wikiSlug : shared?.value;

  useEffect(() => {
    if (!wikiTitle) return;
    setWikiData(null);
    setLoading(true);
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`)
      .then(r => r.json())
      .then(d => { setWikiData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [wikiTitle]);

  if (!shared && !won) return null;
  if (!bestGuess && !won) return null;

  const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(wikiTitle)}`;
  const borderColor = won ? "rgba(74,222,128,0.4)" : "rgba(140,90,20,0.55)";
  const titleColor = won ? "#4ade80" : "#d4a843";

  return (
    <div style={{ marginTop: 28 }}>
      <div style={{ fontSize: 12, letterSpacing: 3, color: "#b47828", marginBottom: 12, textTransform: "uppercase" }}>
        {won ? "🏆 Mystery Species" : "📖 Closest Shared Group"}
      </div>
      <div style={{
        background: won ? "rgba(74,222,128,0.06)" : "rgba(90,55,15,0.4)",
        border: `1px solid ${borderColor}`,
        borderRadius: 12,
        overflow: "hidden",
      }}>
        {loading && (
          <div style={{ padding: 20, color: "#9a7d5a", fontSize: 13 }}>Loading Wikipedia…</div>
        )}
        {!loading && wikiData && (
          <div style={{ padding: "16px 18px" }}>
            {wikiData.thumbnail?.source && (
              <img
                src={wikiData.thumbnail.source}
                alt={wikiData.title}
                style={{
                  width: "100%",
                  maxHeight: 300,
                  minHeight: 120,
                  objectFit: "contain",
                  background: "rgba(0,0,0,0.2)",
                  borderRadius: 8,
                  marginBottom: 12,
                  display: "block",
                }}
              />
            )}
            <div style={{ fontSize: 11, color: "#9a7d5a", textTransform: "uppercase", letterSpacing: 2, marginBottom: 2 }}>
              {won ? "Species" : shared?.rank}
            </div>
            <div style={{ fontSize: 18, fontWeight: "bold", color: titleColor, marginBottom: 8 }}>
              {wikiData.title}
            </div>
            <p style={{ fontSize: 13, color: "#b09878", lineHeight: 1.6, margin: "0 0 14px" }}>
              {(() => {
                const extract = wikiData.extract || "";
                const match = extract.match(/^([^.]+?)\s+(is|was|are|were)\s+/i);
                if (match) {
                  const name = extract.split(/[,(]/)[0].trim();
                  const verb = match[2];
                  const rest = extract.slice(match[0].length);
                  const result = `${name} ${verb} ${rest}`;
                  return result.split(". ").slice(0, 2).join(". ").replace(/\.+$/, "") + ".";
                }
                return extract.split(". ").slice(0, 2).join(". ").replace(/\.+$/, "") + ".";
              })()}
            </p>
            <a href={wikiUrl} target="_blank" rel="noopener noreferrer" style={{
              fontSize: 12, color: titleColor,
              textDecoration: "none",
              border: `1px solid ${borderColor}`,
              padding: "5px 12px", borderRadius: 6,
              display: "inline-block"
            }}>
              Read more on Wikipedia →
            </a>
          </div>
        )}
        {!loading && !wikiData && (
          <div style={{ padding: "16px 18px" }}>
            <div style={{ fontSize: 11, color: "#9a7d5a", textTransform: "uppercase", letterSpacing: 2, marginBottom: 2 }}>
              {won ? "Species" : shared?.rank}
            </div>
            <div style={{ fontSize: 18, fontWeight: "bold", color: titleColor, marginBottom: 10 }}>
              {shared?.display || target.name}
            </div>
            <a href={wikiUrl} target="_blank" rel="noopener noreferrer" style={{
              fontSize: 12, color: titleColor,
              textDecoration: "none",
              border: `1px solid ${borderColor}`,
              padding: "5px 12px", borderRadius: 6,
              display: "inline-block"
            }}>
              Read on Wikipedia →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}



