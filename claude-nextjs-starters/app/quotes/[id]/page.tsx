import Link from 'next/link';
import Container from '@/components/layout/container';
import { Button } from '@/components/ui/button';

type QuoteDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function QuoteDetailPage({ params }: QuoteDetailPageProps) {
  const { id } = await params;

  // TODO: Notion API에서 실제 데이터 조회
  const quote = {
    id,
    quoteNumber: 'Q-001',
    clientName: '클라이언트 A',
    clientEmail: 'client@example.com',
    issueDate: '2026-10-01',
    totalAmount: 1500000,
    items: [
      { name: '상품 A', quantity: 1, unitPrice: 500000 },
      { name: '상품 B', quantity: 2, unitPrice: 250000 },
      { name: '서비스 비용', quantity: 1, unitPrice: 500000 },
    ],
    terms: '결제 조건: 계약 후 50% 선금, 완료 후 50% 후금',
  };

  const subtotal = quote.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  return (
    <Container>
      <div className="py-8 max-w-4xl">
        {/* 헤더 */}
        <div className="mb-8">
          <Link
            href="/quotes"
            className="text-sm text-primary hover:underline mb-4 inline-block"
          >
            ← 목록으로 돌아가기
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{quote.quoteNumber}</h1>
              <p className="text-muted-foreground mt-1">{quote.clientName}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => {/* TODO: PDF 다운로드 */}}>
                PDF 다운로드
              </Button>
              <Button variant="outline" onClick={() => {/* TODO: 복사 */}}>
                공유 링크 복사
              </Button>
            </div>
          </div>
        </div>

        {/* 견적서 내용 */}
        <div className="border border-border rounded-lg p-8 bg-background space-y-8">
          {/* 발행자 정보 */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">발행자</h3>
              <p className="font-medium">귀사</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">클라이언트</h3>
              <p className="font-medium">{quote.clientName}</p>
              <p className="text-sm text-muted-foreground">{quote.clientEmail}</p>
            </div>
          </div>

          <hr className="border-border" />

          {/* 발행일 */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">발행일</h3>
              <p className="font-medium">{quote.issueDate}</p>
            </div>
          </div>

          <hr className="border-border" />

          {/* 항목 테이블 */}
          <div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 font-semibold">항목</th>
                  <th className="text-right py-3 font-semibold w-20">수량</th>
                  <th className="text-right py-3 font-semibold w-32">단가</th>
                  <th className="text-right py-3 font-semibold w-32">금액</th>
                </tr>
              </thead>
              <tbody>
                {quote.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-border">
                    <td className="py-3">{item.name}</td>
                    <td className="text-right py-3">{item.quantity}</td>
                    <td className="text-right py-3">
                      {item.unitPrice.toLocaleString('ko-KR')}원
                    </td>
                    <td className="text-right py-3 font-medium">
                      {(item.quantity * item.unitPrice).toLocaleString('ko-KR')}원
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <hr className="border-border" />

          {/* 합계 */}
          <div className="flex justify-end">
            <div className="w-48">
              <div className="flex justify-between py-2 border-b border-border mb-4">
                <span>소계</span>
                <span>{subtotal.toLocaleString('ko-KR')}원</span>
              </div>
              <div className="flex justify-between py-2 text-lg font-bold">
                <span>합계</span>
                <span>{subtotal.toLocaleString('ko-KR')}원</span>
              </div>
            </div>
          </div>

          <hr className="border-border" />

          {/* 조건 */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">특별 조건</h3>
            <p className="text-sm">{quote.terms}</p>
          </div>
        </div>
      </div>
    </Container>
  );
}
