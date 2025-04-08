'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function About() {
  const features = [
    {
      title: "Versions Multiples",
      description: "Accédez à différentes traductions de la Bible pour une compréhension plus profonde.",
      icon: "📚"
    },
    {
      title: "Navigation Simple",
      description: "Parcourez facilement les livres, chapitres et versets avec une interface intuitive.",
      icon: "🔍"
    },
    {
      title: "Versets Favoris",
      description: "Sauvegardez vos versets préférés pour y accéder rapidement.",
      icon: "⭐"
    },
    {
      title: "Lecture Personnalisée",
      description: "Ajustez la taille du texte pour une lecture confortable.",
      icon: "👀"
    }
  ];

  return (
    <div className="about-page">
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="about-header"
      >
        <h1>À Propos de La Bible en Ligne</h1>
        <p>Votre compagnon d'étude biblique numérique</p>
      </motion.header>

      <motion.section 
        className="about-intro"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2>Notre Mission</h2>
        <p>
          Rendre la Parole de Dieu accessible à tous, en offrant une expérience 
          de lecture moderne et intuitive. Notre application vous permet d'explorer 
          les Écritures dans différentes traductions, de sauvegarder vos passages 
          préférés et de personnaliser votre expérience de lecture.
        </p>
      </motion.section>

      <section className="features-grid">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * (index + 1) }}
          >
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </motion.div>
        ))}
      </section>

      <motion.div
        className="cta-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <h2>Commencez Votre Voyage Spirituel</h2>
        <Link href="/" className="cta-button">
          Explorer la Bible
        </Link>
      </motion.div>
    </div>
  );
}
