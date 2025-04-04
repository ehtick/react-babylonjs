import { Engine } from '@babylonjs/core/Engines/engine.js'
import { WebGPUEngine } from '@babylonjs/core/Engines/webgpuEngine.js'
import { Nullable } from '@babylonjs/core/types.js'
import React, { createContext, useContext } from 'react'
import { SceneContext } from './scene'

export type EngineCanvasContextType = {
  engine: Nullable<Engine | WebGPUEngine>
  canvas: Nullable<HTMLCanvasElement | WebGLRenderingContext>
}

export const EngineCanvasContext = createContext<EngineCanvasContextType>({
  engine: null,
  canvas: null,
})

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export function withEngineCanvasContext<
  P extends { engineCanvasContext: EngineCanvasContextType },
  R = Omit<P, 'engineCanvasContext'>
>(Component: React.ComponentClass<P> | React.FC<P>): React.FC<R> {
  return function BoundComponent(props: R) {
    return (
      <EngineCanvasContext.Consumer>
        {(ctx) => <Component {...(props as any)} engineCanvasContext={ctx} />}
      </EngineCanvasContext.Consumer>
    )
  }
}

/**
 * Get the engine from the context.
 */
export const useEngine = (): Nullable<Engine | WebGPUEngine> => {
  const engineCanvasContext = useContext(EngineCanvasContext)
  const sceneContext = useContext(SceneContext)
  if (engineCanvasContext.engine !== null) {
    return engineCanvasContext.engine
  }

  if (sceneContext.scene !== null) {
    // Could actually be a "ThinEngine":
    //  Abstract
    //  ├──> ThinEngine ──> Engine
    //  └──> WebGPUEngine
    return sceneContext.scene.getEngine() as Engine | WebGPUEngine
  }

  return null
}

/**
 * Get the canvas DOM element from the context.
 */
export const useCanvas = (): Nullable<HTMLCanvasElement | WebGLRenderingContext> => {
  const engineCanvasContext = useContext(EngineCanvasContext)
  const sceneContext = useContext(SceneContext)

  if (engineCanvasContext.engine !== null) {
    return engineCanvasContext.canvas
  }

  if (sceneContext.scene !== null) {
    return sceneContext.scene.getEngine().getRenderingCanvas()
  }

  return null
}
