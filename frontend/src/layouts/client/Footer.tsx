import LanguageSelector from "@/components/LanguageSelector.tsx"

const Footer = () => {
  return (
    <footer className="flex items-center justify-between px-8 py-4 bg-neutral-800 text-white h-28">
      <LanguageSelector />
      <div>
        <p>Nous retrouver</p>
      </div>
      <div className="flex justify-center items-center">
        <p>© 2023 RoadWise, Inc.</p>
      </div>
      <div>
        <h4>Contact</h4>
        <p>roadwise@gmail.com</p>
      </div>
    </footer>
  )
}

export default Footer
