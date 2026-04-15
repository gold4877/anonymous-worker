function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <p style={styles.text}>© 2024 Blind. All rights reserved.</p>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: "#1a1a2e",
    borderTop: "1px solid #333",
    padding: "30px 20px",
    marginTop: "auto",
  },
  container: {
    maxWidth: 1200,
    margin: "0 auto",
  },
  text: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    margin: 0,
  },
};

export default Footer;
