import Footer from "../components/Footer";
import Header from "../components/Header";
import ElementPicker from "../components/ElementPicker";
import "../styles/globals.css";
export default function App({ Component, pageProps }) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
      <ElementPicker
        onSelect={(element, info) =>
          console.log("picked element", element, "\n info", info)
        }
      />
      <Footer />
    </>
  );
}
