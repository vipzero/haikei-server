import { printId } from '../utils/tableTimeLogger'

test('printId', () => {
  const urlId = printId(
    'https://www.google.com/search?q=test&oq=test+&gs_lcrp=EgZjaHJvbWUqBwgAEAAYjwIyBwgAEAAYjwIyDQgBEAAYgwEYsQMYgAQyDQgCEAAYgwEYsQMYgAQyBggDEEUYPDIGCAQQRRg8MgYIBRBFGDwyBggGEEUYPDIGCAcQRRhB0gEHOTYwajBqNKgCALACAQ&sourceid=chrome&ie=UTF-8'
  )
  expect(urlId).toMatchInlineSnapshot(
    `"www.google.com/search?q=test&oq=test+&gs_[90m~[39mie=UTF-8"`
  )
  expect(urlId.length).toMatchInlineSnapshot(`60`)
})
