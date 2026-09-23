type ExportValue = string | number | boolean | null;
type ExportRow = Record<string, ExportValue>;

function main(
  workbook: ExcelScript.Workbook,
  rowsJson: string
): { rowCount: number; receiptCount: number } {
  const tableName = "tblTATExport";
  const table = workbook.getTable(tableName);

  if (!table) {
    throw new Error(`Excel 표 '${tableName}'을 찾을 수 없습니다.`);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rowsJson);
  } catch (error) {
    throw new Error("rowsJson이 올바른 JSON 배열이 아닙니다.");
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("내보낼 행이 없습니다.");
  }

  const rows = parsed as ExportRow[];
  const expectedKeys = [
    "의뢰일자",
    "접수번호",
    "업체",
    "계산서 업체",
    "시료명",
    "시료수",
    "구분",
    "분석항목",
    "수량",
    "단가",
    "공급가액",
    "부가세",
    "항목별 총액",
    "총금액",
    "연도",
    "월",
    "주차",
    "주차표시",
    "TAT",
    "표준처리기한",
    "분석상태이관",
    "분석완료일이관",
    "결과발송여부이관"
  ];

  rows.forEach((row, index) => {
    expectedKeys.forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(row, key)) {
        throw new Error(`${index + 1}번째 행에 '${key}' 키가 없습니다.`);
      }
    });
  });

  const receiptTotals = new Map<string, number>();
  rows.forEach((row, index) => {
    const receiptNumber = requiredText(row["접수번호"], "접수번호", index);
    const quantity = requiredNumber(row["수량"], "수량", index);
    const unitPrice = requiredNumber(row["단가"], "단가", index);
    const supplyAmount = quantity * unitPrice;
    receiptTotals.set(
      receiptNumber,
      (receiptTotals.get(receiptNumber) ?? 0) + supplyAmount
    );
  });

  const seenReceipts = new Set<string>();
  const values: (string | number | boolean)[][] = rows.map((row, index) => {
    const requestDate = requiredDate(row["의뢰일자"], "의뢰일자", index);
    const receiptNumber = requiredText(row["접수번호"], "접수번호", index);
    const sampleCount = requiredNumber(row["시료수"], "시료수", index);
    const quantity = requiredNumber(row["수량"], "수량", index);
    const unitPrice = requiredNumber(row["단가"], "단가", index);
    const supplyAmount = quantity * unitPrice;
    const vat = supplyAmount * 0.1;
    const itemTotal = supplyAmount + vat;
    const firstReceiptRow = !seenReceipts.has(receiptNumber);
    const totalAmount = firstReceiptRow
      ? (receiptTotals.get(receiptNumber) ?? 0)
      : "";
    const week = weekNumberMonday(requestDate);
    const year = requestDate.getUTCFullYear();
    const month = requestDate.getUTCMonth() + 1;
    const weekLabel = `${String(year).slice(-2)}년 ${String(week).padStart(2, "0")}주차`;
    const completedDate = optionalDate(row["분석완료일이관"], "분석완료일이관", index);

    seenReceipts.add(receiptNumber);

    return [
      excelDateSerial(requestDate),
      receiptNumber,
      text(row["업체"]),
      text(row["계산서 업체"]),
      text(row["시료명"]),
      sampleCount,
      text(row["구분"]),
      text(row["분석항목"]),
      quantity,
      unitPrice,
      supplyAmount,
      vat,
      itemTotal,
      totalAmount,
      year,
      month,
      week,
      weekLabel,
      "",
      "",
      text(row["분석상태이관"]),
      completedDate ? excelDateSerial(completedDate) : "",
      text(row["결과발송여부이관"])
    ];
  });

  while (table.getRowCount() > 0) {
    table.deleteRowsAt(0, Math.min(1000, table.getRowCount()));
  }

  table.addRows(-1, values);

  return {
    rowCount: values.length,
    receiptCount: seenReceipts.size
  };
}

function text(value: ExportValue): string {
  return value === null || value === undefined ? "" : String(value);
}

function requiredText(value: ExportValue, name: string, index: number): string {
  const result = text(value).trim();
  if (result === "") {
    throw new Error(`${index + 1}번째 행의 '${name}' 값이 비어 있습니다.`);
  }
  return result;
}

function requiredNumber(value: ExportValue, name: string, index: number): number {
  if (value === null || value === undefined || value === "") {
    throw new Error(`${index + 1}번째 행의 '${name}' 값이 비어 있습니다.`);
  }
  const result = Number(value);
  if (!Number.isFinite(result)) {
    throw new Error(`${index + 1}번째 행의 '${name}' 값이 숫자가 아닙니다.`);
  }
  return result;
}

function requiredDate(value: ExportValue, name: string, index: number): Date {
  const result = parseDate(value);
  if (!result) {
    throw new Error(`${index + 1}번째 행의 '${name}' 값이 올바른 날짜가 아닙니다.`);
  }
  return result;
}

function optionalDate(value: ExportValue, name: string, index: number): Date | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const result = parseDate(value);
  if (!result) {
    throw new Error(`${index + 1}번째 행의 '${name}' 값이 올바른 날짜가 아닙니다.`);
  }
  return result;
}

function parseDate(value: ExportValue): Date | null {
  const input = text(value).trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(input);
  if (!match) {
    return null;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const result = new Date(Date.UTC(year, month - 1, day));
  if (
    result.getUTCFullYear() !== year ||
    result.getUTCMonth() !== month - 1 ||
    result.getUTCDate() !== day
  ) {
    return null;
  }
  return result;
}

function excelDateSerial(date: Date): number {
  const excelEpoch = Date.UTC(1899, 11, 30);
  return Math.floor((date.getTime() - excelEpoch) / 86400000);
}

function weekNumberMonday(date: Date): number {
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const daysSinceMonday = (yearStart.getUTCDay() + 6) % 7;
  const dayOfYear =
    Math.floor((date.getTime() - yearStart.getTime()) / 86400000) + 1;
  return Math.floor((dayOfYear + daysSinceMonday - 1) / 7) + 1;
}
