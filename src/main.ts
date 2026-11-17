import { bootstrap } from './app/bootstrap'
import './main.css'

bootstrap().catch((error: unknown) => {
  console.error('[Main] Application initialization failed:', error)
})
