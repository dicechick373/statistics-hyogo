import client from '~/plugins/contentful'

export const getFieldList = async () => {
  const entries = await client.getEntries({
    content_type: 'statisticsField',
  })
  return entries.items.map((d) => d.fields)
}
