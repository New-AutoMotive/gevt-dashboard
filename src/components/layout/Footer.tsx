export default function Footer() {
  return (
    <footer className="mt-4 px-4 py-3 text-center text-xs text-gray-500">
      <p>
        Data licensed under{" "}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-700"
        >
          CC BY 4.0
        </a>
        .{" "}
        <a
          href="/GEVT_methodology.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-700"
        >
          Methodology
        </a>
      </p>
    </footer>
  );
}
