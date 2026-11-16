"""Match the original inventory to a saved API price snapshot."""
import csv
import json
import sys
from collections import defaultdict
from decimal import Decimal, InvalidOperation


def cents(value):
    try:
        amount = Decimal(str(value)) * 100
        if amount.is_finite() and 0 < amount <= 2**31 - 1 and amount == int(amount):
            return int(amount)
    except InvalidOperation:
        pass
    return None


def enrich(source, snapshot, output):
    prices = defaultdict(set)
    with open(snapshot, encoding="utf-8") as file:
        for product in json.load(file):
            variants = product.get("sub_products") or []
            if isinstance(variants, dict):
                variants = variants.values()
            for item in [product, *variants]:
                if isinstance(item, dict) and item.get("sku"):
                    prices[str(item["sku"]).strip()].add(
                        (cents(item.get("price")), cents(item.get("discount")))
                    )

    counts = defaultdict(int)
    with open(source, newline="", encoding="utf-8-sig") as original, open(
        output, "w", newline="", encoding="utf-8"
    ) as destination:
        rows = csv.DictReader(original)
        writer = csv.DictWriter(destination, rows.fieldnames + ["RetailCents", "SaleCents", "PriceStatus"])
        writer.writeheader()
        for row in rows:
            matches = prices.get(row["SKU"].strip(), set())
            regular, sale = None, None
            if len(matches) > 1:
                status = "conflicting"
            elif not matches:
                status = "unmatched"
            else:
                regular, sale = next(iter(matches))
                status = "matched" if regular and (sale is None or sale <= regular) else "review"
            if status != "matched":
                regular, sale = None, None
            counts[status] += 1
            writer.writerow(dict(row, RetailCents=regular, SaleCents=sale, PriceStatus=status))
    print(json.dumps(dict(counts), sort_keys=True))


if __name__ == "__main__":
    enrich(*sys.argv[1:])
