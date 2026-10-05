import Link from 'next/link';
import Container from '@/components/layout/container';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// TODO: 실제 데이터는 Notion API에서 조회
const mockQuotes = [
  {
    id: '1',
    quoteNumber: 'Q-001',
    clientName: '클라이언트 A',
    amount: 1500000,
    status: 'sent' as const,
    issuedDate: '2026-10-01',
  },
  {
    id: '2',
    quoteNumber: 'Q-002',
    clientName: '클라이언트 B',
    amount: 2500000,
    status: 'approved' as const,
    issuedDate: '2026-09-28',
  },
];

const statusLabels: Record<string, string> = {
  draft: '작성 중',
  sent: '발송됨',
  approved: '승인됨',
  rejected: '거절됨',
};

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  sent: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export default function QuotesPage() {
  return (
    <Container>
      <div className="py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">견적서 목록</h1>
            <p className="text-muted-foreground mt-1">
              작성한 모든 견적서를 확인하고 관리하세요
            </p>
          </div>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            새 견적서
          </button>
        </div>

        {mockQuotes.length === 0 ? (
          <Card className="text-center py-12">
            <CardHeader>
              <CardTitle>견적서가 없습니다</CardTitle>
              <CardDescription>
                새 견적서를 만들어서 클라이언트에게 전달하세요
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">견적번호</th>
                  <th className="text-left py-3 px-4 font-semibold">클라이언트</th>
                  <th className="text-right py-3 px-4 font-semibold">금액</th>
                  <th className="text-left py-3 px-4 font-semibold">상태</th>
                  <th className="text-left py-3 px-4 font-semibold">발행일</th>
                  <th className="text-left py-3 px-4 font-semibold">동작</th>
                </tr>
              </thead>
              <tbody>
                {mockQuotes.map((quote) => (
                  <tr key={quote.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{quote.quoteNumber}</td>
                    <td className="py-3 px-4">{quote.clientName}</td>
                    <td className="py-3 px-4 text-right">
                      {quote.amount.toLocaleString('ko-KR')}원
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className={statusColors[quote.status]}
                      >
                        {statusLabels[quote.status]}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">{quote.issuedDate}</td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/quotes/${quote.id}`}
                        className="text-primary hover:underline text-sm"
                      >
                        보기
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Container>
  );
}
