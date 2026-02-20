import App from './App'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

describe('App Component', () => {
    it('renders the heading', () => {
        render(<App />)
        expect(screen.getByText(/Task Manager/i)).toBeInTheDocument()
    })
})