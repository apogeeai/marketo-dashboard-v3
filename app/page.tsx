'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon, CheckCircle2, Circle, ChevronRight, Plus, Minus } from 'lucide-react'

const initialChecklistData = {
  'Program & Campaigns': ['Naming conventions', 'Correct folder', 'Program type', 'Program flow', 'Smart Lists'],
  'Email 1': ['From Name', 'From Address', 'Reply-to', 'Subject line', 'Preheader', 'Content', 'Tokens'],
  'Reporting': ['Send date', 'Global settings', 'Email selection', 'Smart list'],
  'Lists': ['List count', 'Upload template'],
  'Sign Off': ['Signatures', 'Approval dates'],
}

export default function Component() {
  const [checklistData, setChecklistData] = useState(initialChecklistData)
  const [activeSection, setActiveSection] = useState('Program & Campaigns')
  const [checklist, setChecklist] = useState({})
  const [darkMode, setDarkMode] = useState(false)
  const [emailCount, setEmailCount] = useState(1)

  useEffect(() => {
    const initialChecklist = Object.fromEntries(
      Object.entries(checklistData).map(([section, items]) => [
        section,
        items.map(() => false)
      ])
    )
    setChecklist(initialChecklist)
  }, [checklistData])

  const handleCheckboxChange = (section, index) => {
    setChecklist(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => (i === index ? !item : item)),
    }))
  }

  const isAllChecked = Object.values(checklist).every(section => section.every(item => item))

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const addEmailTab = () => {
    const newEmailCount = emailCount + 1
    setEmailCount(newEmailCount)
    const newEmailKey = `Email ${newEmailCount}`
    const newChecklistData = {}
    let lastEmailIndex = 0
    
    for (const [key, value] of Object.entries(checklistData)) {
      if (key.startsWith('Email')) {
        const emailNumber = parseInt(key.split(' ')[1])
        if (emailNumber > lastEmailIndex) {
          lastEmailIndex = emailNumber
        }
      }
      newChecklistData[key] = value
      if (key === `Email ${lastEmailIndex}`) {
        newChecklistData[newEmailKey] = ['From Name', 'From Address', 'Reply-to', 'Subject line', 'Preheader', 'Content', 'Tokens']
      }
    }
    
    setChecklistData(newChecklistData)
    setActiveSection(newEmailKey)
  }

  const removeEmailTab = () => {
    if (emailCount > 1) {
      const newEmailCount = emailCount - 1
      setEmailCount(newEmailCount)
      const removedEmailKey = `Email ${emailCount}`
      const newChecklistData = {}
      
      for (const [key, value] of Object.entries(checklistData)) {
        if (key !== removedEmailKey) {
          newChecklistData[key] = value
        }
      }
      
      setChecklistData(newChecklistData)
      setActiveSection(`Email ${newEmailCount}`)
    }
  }

  const renderSidebarItems = () => {
    const items = []
    let emailSections = []

    for (const section of sortedSections) {
      if (section.startsWith('Email')) {
        emailSections.push(
          <li key={section}>
            <button
              onClick={() => setActiveSection(section)}
              className={`w-full text-left p-4 transition-colors duration-200 flex justify-between items-center ${
                activeSection === section
                  ? darkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500 text-white'
                  : darkMode
                  ? 'hover:bg-gray-700'
                  : 'hover:bg-gray-100'
              } border-t border-gray-200 dark:border-gray-700`}
            >
              {section}
              <ChevronRight size={20} className={activeSection === section ? 'rotate-90' : ''} />
            </button>
          </li>
        )
      } else {
        if (emailSections.length > 0) {
          items.push(...emailSections)
          items.push(
            <li key="email-controls">
              <div className="p-2 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2">
                <button
                  onClick={addEmailTab}
                  className={`p-2 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                  aria-label="Add Email Tab"
                >
                  <Plus size={16} />
                </button>
                <button
                  onClick={removeEmailTab}
                  className={`p-2 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${emailCount === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={emailCount === 1}
                  aria-label="Remove Email Tab"
                >
                  <Minus size={16} />
                </button>
              </div>
            </li>
          )
          emailSections = []
        }
        items.push(
          <li key={section}>
            <button
              onClick={() => setActiveSection(section)}
              className={`w-full text-left p-4 transition-colors duration-200 flex justify-between items-center ${
                activeSection === section
                  ? darkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500 text-white'
                  : darkMode
                  ? 'hover:bg-gray-700'
                  : 'hover:bg-gray-100'
              } ${section !== 'Program & Campaigns' ? 'border-t border-gray-200 dark:border-gray-700' : ''}`}
            >
              {section}
              <ChevronRight size={20} className={activeSection === section ? 'rotate-90' : ''} />
            </button>
          </li>
        )
      }
    }

    if (emailSections.length > 0) {
      items.push(...emailSections)
      items.push(
        <li key="email-controls">
          <div className="p-2 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2">
            <button
              onClick={addEmailTab}
              className={`p-2 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              aria-label="Add Email Tab"
            >
              <Plus size={16} />
            </button>
            <button
              onClick={removeEmailTab}
              className={`p-2 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${emailCount === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={emailCount === 1}
              aria-label="Remove Email Tab"
            >
              <Minus size={16} />
            </button>
          </div>
        </li>
      )
    }

    return items
  }

  const sortedSections = Object.keys(checklistData).sort((a, b) => {
    if (a.startsWith('Email') && b.startsWith('Email')) {
      return parseInt(a.split(' ')[1]) - parseInt(b.split(' ')[1])
    }
    if (a === 'Program & Campaigns') return -1
    if (b === 'Program & Campaigns') return 1
    if (a.startsWith('Email')) return -1
    if (b.startsWith('Email')) return 1
    if (a === 'Reporting') return -1
    if (b === 'Reporting') return 1
    if (a === 'Lists') return -1
    if (b === 'Lists') return 1
    return 0
  })

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold">Marketo QA Checklist</h1>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-yellow-400'}`}
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <nav className="md:col-span-1">
            <div className={`rounded-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <ul>
                {renderSidebarItems()}
              </ul>
            </div>
          </nav>

          <main className="md:col-span-2">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
            >
              <h2 className="text-2xl font-semibold mb-4">{activeSection}</h2>
              <ul className="space-y-3">
                {checklistData[activeSection]?.map((item, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <button
                      onClick={() => handleCheckboxChange(activeSection, index)}
                      className="focus:outline-none"
                      aria-label={`Toggle ${item}`}
                    >
                      {checklist[activeSection]?.[index] ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400" />
                      )}
                    </button>
                    <span
                      className={`transition-all duration-300 ease-in-out ${
                        checklist[activeSection]?.[index]
                          ? 'line-through text-gray-500 dark:text-gray-400'
                          : ''
                      }`}
                      style={{
                        textDecorationColor: darkMode ? '#4B5563' : '#9CA3AF',
                        textDecorationThickness: '2px',
                      }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </main>
        </div>

        <footer className="mt-8">
          <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="mb-4 sm:mb-0">
                <h3 className="text-lg font-semibold">Sign Off</h3>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  All items have been checked and approved.
                </p>
              </div>
              <button
                className={`px-6 py-3 rounded-lg text-white font-semibold transition-colors duration-200 ${
                  isAllChecked
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
                disabled={!isAllChecked}
              >
                Approved
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}