export default function AuthLayout({ title, children, footer }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-lg rounded shadow-lg border-solid border-2 p-10">
        <div className="mb-4 text-center">
          <span className="text-xl font-bold">{title}</span>
        </div>
        <div>{children}</div>
        {footer && <div className="mt-4 text-center">{footer}</div>}
      </div>
    </div>
  );
}
