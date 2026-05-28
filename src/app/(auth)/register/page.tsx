import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-[var(--color-border)] p-8">
      <h2 className="text-xl font-bold text-[var(--color-text)] mb-6 text-center">
        Daftar Tenant Baru
      </h2>
      
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
            Nama Bisnis
          </label>
          <input
            type="text"
            className="w-full px-4 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]"
            placeholder="Wina Al-Husna Wedding"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
            Email
          </label>
          <input
            type="email"
            className="w-full px-4 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]"
            placeholder="email@perusahaan.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
            Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2.5 bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] text-white font-semibold rounded-lg transition-colors mt-2"
        >
          Daftar Sekarang
        </button>
      </form>
      
      <p className="text-center text-sm text-[var(--color-muted)] mt-6">
        Sudah punya akun?{" "}
        <Link href="/login" className="text-[var(--color-gold-600)] font-semibold hover:underline">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}
