export const dynamic = 'force-dynamic'
import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'

const prisma = new PrismaClient()

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { orders: true }
      }
    }
  })

  const deleteUser = async (formData: FormData) => {
    'use server'
    const id = formData.get('id') as string
    if (id) {
      await prisma.user.delete({ where: { id } })
      revalidatePath('/admin/users')
    }
  }

  return (
    <div className="bg-surface border border-border rounded-sm p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-display font-medium text-foreground">Kullanıcı Yönetimi</h1>
        <span className="text-xs font-bold tracking-[0.1em] text-text-secondary bg-bg px-4 py-2 rounded-full border border-border">TOPLAM {users.length} HESAP</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg border-b border-border text-xs font-bold tracking-[0.1em] text-text-secondary uppercase">
            <tr>
              <th className="px-4 py-4">Kullanıcı</th>
              <th className="px-4 py-4">Rol</th>
              <th className="px-4 py-4">Kayıt Tarihi</th>
              <th className="px-4 py-4">Sipariş Sayısı</th>
              <th className="px-4 py-4 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-bg transition-colors">
                <td className="px-4 py-4">
                  <div className="flex flex-col">
                    <Link href={`/admin/users/${user.id}`} className="font-medium text-foreground hover:text-primary transition-colors underline-offset-4 hover:underline w-fit">{user.name}</Link>
                    <span className="text-xs text-text-secondary">{user.email}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded border ${user.role === 'ADMIN' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-4 text-text-secondary">{new Date(user.createdAt).toLocaleDateString('tr-TR')}</td>
                <td className="px-4 py-4">
                  <span className="font-mono text-foreground font-medium">{user._count.orders}</span>
                </td>
                <td className="px-4 py-4 text-right">
                  <form action={deleteUser}>
                    <input type="hidden" name="id" value={user.id} />
                    <button type="submit" disabled={user.role === 'ADMIN'} className="text-xs text-red-500 hover:text-red-400 font-bold tracking-[0.1em] uppercase disabled:opacity-30 disabled:cursor-not-allowed">
                      Sil
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
