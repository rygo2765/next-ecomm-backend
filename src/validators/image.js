export function validateImage(input) {
  const validationErrors = {}

  if (!('title' in input) || input['title'].length == 0) {
    validationErrors['title'] = 'cannot be blank'
  }

  if (!('price' in input) || input['price'].length == 0) {
    validationErrors['price'] = 'cannot be blank'
  }

  if(!('description' in input) || input['description'].length == 0){
    validationErrors['price'] = 'cannot be blank'
  }

  return validationErrors
}