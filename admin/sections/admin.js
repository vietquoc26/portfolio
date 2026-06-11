<script>
/* ==========================================
   ABOUT SECTION INIT
========================================== */

function initAboutSection() {

  const aboutSectionEditBtn =
    document.getElementById('editAboutSection')

  const saveAboutSectionBtn =
    document.getElementById('saveAboutSection')

  if (!aboutSectionEditBtn) return

  // =============================
  // LANGUAGE TOGGLE
  // =============================

  document.getElementById('lang-en')?.addEventListener('click', () => {

    currentLang = 'en'

    loadAboutSection()

  })

  document.getElementById('lang-vi')?.addEventListener('click', () => {

    currentLang = 'vi'

    loadAboutSection()

  })

  // =============================
  // EDIT BUTTON
  // =============================

  aboutSectionEditBtn.addEventListener('click', async () => {

    const section =
      document.getElementById('aboutSection')

    if (!section) return

    const editableElements =
      section.querySelectorAll('.editable')

    const isEditing =
      editableElements[0]?.contentEditable === 'true'

    editableElements.forEach(el => {

      el.contentEditable =
        isEditing ? 'false' : 'true'

      el.classList.toggle('border', !isEditing)
      el.classList.toggle('border-dashed', !isEditing)
      el.classList.toggle('border-blue-500', !isEditing)
      el.classList.toggle('p-1', !isEditing)
      el.classList.toggle('rounded', !isEditing)

    })

    if (isEditing) {

      saveAboutSectionBtn.classList.add('hidden')

      aboutSectionEditBtn.innerHTML =
        '<i class="fas fa-edit mr-1"></i> Edit About'

      await loadAboutSection()

    } else {

      saveAboutSectionBtn.classList.remove('hidden')

      aboutSectionEditBtn.innerHTML =
        '<i class="fas fa-times mr-1"></i> Cancel'

    }

  })

  // =============================
  // SAVE BUTTON
  // =============================

  saveAboutSectionBtn?.addEventListener('click', async () => {

    await saveAboutSection()

    saveAboutSectionBtn.classList.add('hidden')

    aboutSectionEditBtn.innerHTML =
      '<i class="fas fa-edit mr-1"></i> Edit About'

    const section =
      document.getElementById('aboutSection')

    const editableElements =
      section.querySelectorAll('.editable')

    editableElements.forEach(el => {

      el.contentEditable = 'false'

      el.classList.remove(
        'border',
        'border-dashed',
        'border-blue-500',
        'p-1',
        'rounded'
      )

    })

  })

}


/* ==========================================
   LOAD ABOUT SECTION
========================================== */

async function loadAboutSection() {

  const section =
    document.getElementById('aboutSection')

  if (!section) return

  const editableElements =
    section.querySelectorAll('.editable')

  const { data, error } =
    await supabase
      .from('about_section')
      .select('*')

  if (error) {

    console.error(
      '❌ Error loading about_section:',
      error.message
    )

    return
  }

  editableElements.forEach(el => {

    const key =
      el.getAttribute('data-i18n')

    const row =
      data.find(item => item.key === key)

    if (!row) return

    el.textContent =
      currentLang === 'en'
        ? (row.en_text || '')
        : (row.vi_text || '')

  })

}


/* ==========================================
   SAVE ABOUT SECTION
========================================== */

async function saveAboutSection() {

  const section =
    document.getElementById('aboutSection')

  if (!section) return

  const editableElements =
    section.querySelectorAll('.editable')

  for (const el of editableElements) {

    const key =
      el.getAttribute('data-i18n')

    if (!key) continue

    const text =
      el.textContent.trim()

    const updates =
      currentLang === 'en'
        ? {
            key,
            en_text: text
          }
        : {
            key,
            vi_text: text
          }

    const { error } =
      await supabase
        .from('about_section')
        .upsert(
          updates,
          {
            onConflict: 'key'
          }
        )

    if (error) {

      console.error(
        `❌ Failed saving ${key}:`,
        error.message
      )

    } else {

      console.log(
        `✅ Saved ${key}`
      )

    }

  }

  alert('About Section saved successfully! ✅')

}

</script>