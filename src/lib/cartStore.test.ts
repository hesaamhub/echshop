import test from "node:test"
import assert from "node:assert/strict"
import {
  addCartItem,
  computeCartTotals,
  removeCartItem,
  resolveCartLines,
  setCartItemQuantity,
} from "./cartStore"

test("cart operations add, update quantity, remove, and clamp totals", () => {
  let items = addCartItem([], "p-1", "pl-1", 1)
  items = addCartItem(items, "p-1", "pl-1", 2)
  assert.equal(items.length, 1)
  assert.equal(items[0].quantity, 3)

  items = setCartItemQuantity(items, "p-1", "pl-1", 2)
  assert.equal(items[0].quantity, 2)

  const lines = resolveCartLines(items)
  assert.equal(lines.length, 1)

  const totals = computeCartTotals(lines, 10_000_000)
  assert.equal(totals.count, 2)
  assert.equal(totals.total, 0)

  items = removeCartItem(items, "p-1", "pl-1")
  assert.equal(items.length, 0)
})
