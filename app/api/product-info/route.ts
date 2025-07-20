import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const barcode = searchParams.get('barcode');

  if (!barcode) {
    return NextResponse.json({ error: 'バーコードが指定されていません' }, { status: 400 });
  }

  try {
    // バーコードから商品名を生成
    const productName = `商品_${barcode}`;
    
    return NextResponse.json({
      name: productName,
      success: true,
      message: 'バーコードから商品名を生成しました'
    });

  } catch (error) {
    console.error('商品情報生成エラー:', error);
    return NextResponse.json({
      name: `商品_${barcode}`,
      success: false,
      message: '商品名生成に失敗しました'
    });
  }
} 