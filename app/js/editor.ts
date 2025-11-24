// @ts-nocheck

const clientOnlyImports = [
  'tinymce/tinymce',
  'tinymce/icons/default',
  'tinymce/themes/silver',
  'tinymce/plugins/advlist',
  'tinymce/plugins/anchor',
  'tinymce/plugins/autolink',
  'tinymce/plugins/autoresize',
  'tinymce/plugins/autosave',
  'tinymce/plugins/charmap',
  'tinymce/plugins/code',
  'tinymce/plugins/codesample',
  'tinymce/plugins/directionality',
  'tinymce/plugins/emoticons',
  'tinymce/plugins/fullscreen',
  'tinymce/plugins/help',
  'tinymce/plugins/image',
  'tinymce/plugins/importcss',
  'tinymce/plugins/insertdatetime',
  'tinymce/plugins/link',
  'tinymce/plugins/lists',
  'tinymce/plugins/media',
  'tinymce/plugins/nonbreaking',
  'tinymce/plugins/pagebreak',
  'tinymce/plugins/preview',
  'tinymce/plugins/quickbars',
  'tinymce/plugins/save',
  'tinymce/plugins/searchreplace',
  'tinymce/plugins/table',
  'tinymce/plugins/visualblocks',
  'tinymce/plugins/visualchars',
  'tinymce/plugins/wordcount',
]

if (typeof window !== 'undefined') {
  await Promise.all(clientOnlyImports.map((path) => import(path)))
}
