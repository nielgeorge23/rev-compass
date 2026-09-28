'use client'

import { ChevronDown } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

type MultiSelectFilterProps = {
  options: string[]
  selected: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  searchable?: boolean
}

export function MultiSelectFilter({
  options,
  selected,
  onChange,
  placeholder = 'All',
  searchable = false,
}: MultiSelectFilterProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  const visibleOptions = useMemo(() => {
    if (!query.trim()) return options
    const q = query.toLowerCase()
    return options.filter((option) => option.toLowerCase().includes(q))
  }, [options, query])

  function toggle(value: string) {
    onChange(
      selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value],
    )
  }

  const triggerLabel =
    selected.length === 0
      ? placeholder
      : selected.length === 1
        ? selected[0]
        : `${selected.length} selected`

  return (
    <div className="claims-multiselect" ref={rootRef}>
      <button
        type="button"
        className={`claims-multiselect-trigger ${selected.length > 0 ? 'claims-multiselect-trigger-active' : ''}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="claims-multiselect-value">{triggerLabel}</span>
        <ChevronDown size={14} />
      </button>
      {open ? (
        <div className="claims-multiselect-menu" role="listbox">
          {searchable ? (
            <input
              type="search"
              className="claims-multiselect-search"
              placeholder="Search…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          ) : null}
          <div className="claims-multiselect-actions">
            <button type="button" onClick={() => onChange([...options])}>
              Select all
            </button>
            <button type="button" onClick={() => onChange([])}>
              Clear
            </button>
          </div>
          <div className="claims-multiselect-options">
            {visibleOptions.length === 0 ? (
              <p className="claims-multiselect-empty">No matches</p>
            ) : (
              visibleOptions.map((option) => (
                <label key={option} className="claims-multiselect-option">
                  <input
                    type="checkbox"
                    checked={selected.includes(option)}
                    onChange={() => toggle(option)}
                  />
                  <span>{option}</span>
                </label>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
