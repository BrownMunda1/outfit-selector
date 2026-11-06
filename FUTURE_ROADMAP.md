# Future State & Technical Roadmap

The long-term vision for FitDecide is to evolve it from a wardrobe-specific recommendation chatbot into an **agentic personal styling assistant** capable of understanding user preferences, gathering contextual information, planning multi-step tasks, and executing them through a set of specialized tools.

The system will progressively move towards an event-driven, distributed architecture, with an emphasis on reliability, scalability, observability, security, and evaluation.

## 1. Agentic Capabilities

### 1.1 Tool-Using Outfit Agent
- Introduce a tool-calling agent capable of dynamically selecting tools based on the user's query.
- Expose capabilities such as:
  - `get_wardrobe()`: Retrieve the user's wardrobe.
  - `search_wardrobe(filters)`: Search clothing based on attributes such as colour, category, occasion, and formality.
  - `get_user_preferences()`: Retrieve user-specific styling preferences.
  - `get_weather(location)`: Retrieve weather information for a destination.
  - `get_outfit_history()`: Retrieve previously recommended outfits.
  - `save_outfit(outfit)`: Save an outfit for future reference.
  - `rate_outfit(outfit, rating)`: Collect feedback on recommendations.
- Implement controlled tool execution, structured outputs, error handling, and tool-selection logic.

### 1.2 Multi-Agent Orchestration
Introduce specialized agents with clearly defined responsibilities, coordinated by a supervisor agent.

Potential agents:

- **Wardrobe Agent:** Retrieves and manages wardrobe information.
- **Styling Agent:** Evaluates clothing combinations and generates outfit recommendations.
- **Context Agent:** Retrieves contextual information such as weather, location, occasion, and calendar events.
- **Outfit Composer:** Combines the outputs of specialized agents and produces the final recommendation.

Explore LangGraph capabilities including:
- Supervisor/worker architecture.
- Conditional routing and parallel execution.
- Subgraphs and agent delegation.
- State management and checkpointing.
- Retry mechanisms and failure recovery.
- Human-in-the-loop workflows.

Multi-agent orchestration should be introduced only where task decomposition provides a meaningful advantage over a single agent.

### 1.3 Persistent State and Memory
Enable conversations and workflows to retain relevant context across sessions.

- Persist conversation history and agent execution state.
- Maintain structured user preferences, such as preferred colours, styles, and disliked combinations.
- Maintain semantic memory of previous outfit recommendations and user feedback.
- Support contextual follow-up queries such as: "Show me something similar to the outfit you suggested last Friday, but make it less formal."
- Explore the distinction between short-term conversational state, long-term user memory, and application data.

### 1.4 MCP Integration
Introduce Model Context Protocol (MCP) to decouple agent reasoning from the underlying application capabilities.

Potential MCP servers:

- **Wardrobe MCP:** Search, retrieve, update, and manage wardrobe items.
- **Weather MCP:** Retrieve weather information.
- **Calendar MCP:** Retrieve upcoming events and relevant scheduling context.
- **Shopping MCP:** Search for clothing and accessories based on missing wardrobe items.

Explore:
- MCP tool discovery and invocation.
- Tool schemas and structured responses.
- MCP client/server architecture.
- Authentication and authorization.
- Permission boundaries and secure tool execution.

## 2. Distributed Systems & Event-Driven Architecture

### 2.1 Asynchronous Image Processing Pipeline
Move wardrobe image processing away from synchronous API execution.

Proposed workflow:

1. User uploads one or more wardrobe images.
2. Backend stores the original image and creates a processing record.
3. An event is published indicating that a wardrobe item has been uploaded.
4. Background workers independently process images and generate structured metadata.
5. Embeddings are generated and stored in the vector database.
6. Processing status is updated once all required operations are complete.
7. User is notified when the wardrobe item becomes available.

Explore:
- Message queues and event-driven communication.
- Independent worker services.
- Horizontal scalability.
- Eventual consistency.
- Idempotent processing.
- Retry policies and exponential backoff.
- Dead-letter queues (DLQs).
- Handling partial failures.

### 2.2 Event-Driven Architecture
Introduce domain events to decouple different application components.

Potential events:

- `WardrobeItemUploaded`
- `ImageProcessingStarted`
- `ImageMetadataGenerated`
- `EmbeddingGenerated`
- `WardrobeItemReady`
- `OutfitGenerated`
- `OutfitRated`

Explore event publishing, event consumers, message ordering, duplicate delivery, and eventual consistency.

### 2.3 Long-Running Agent Workflows
Support requests that require multiple independent operations and may take longer than a typical HTTP request.

Example:

"Plan five outfits for my five-day trip to Goa next month."

Proposed workflow:

1. Create a workflow execution record.
2. Generate an execution plan.
3. Retrieve wardrobe, weather, and user preferences.
4. Generate candidate outfits.
5. Validate outfit combinations against user constraints.
6. Persist the recommendations.
7. Update workflow status.
8. Notify the user when the workflow completes.

Support:
- Asynchronous job execution.
- Workflow status tracking.
- Checkpointing and resumability.
- Retry and recovery.
- Partial completion.
- Workflow cancellation.
- Idempotent execution.

### 2.4 Reliability and Fault Tolerance
Introduce resilience mechanisms across application components.

- Timeouts and retries for external API calls.
- Exponential backoff.
- Circuit breakers.
- Graceful degradation when external services are unavailable.
- Idempotency for state-changing operations.
- Failure recovery for background workers.
- Dead-letter queue processing.
- Handling duplicate and out-of-order events.

## 3. Context-Aware Recommendations

### 3.1 Weather-Based Recommendations
Integrate a weather provider to account for temperature, rainfall, humidity, and other relevant conditions.

### 3.2 Calendar Integration
Allow users to connect their calendars so that FitDecide can understand upcoming events and recommend appropriate outfits.

### 3.3 Trip-Based Outfit Planning
Allow users to provide a destination, travel dates, and trip context.

The agent should:
- Retrieve destination weather.
- Understand the duration and nature of the trip.
- Generate outfits for individual days.
- Avoid unnecessary repetition.
- Create a packing checklist.
- Identify missing clothing or accessories.

### 3.4 Shopping Recommendations
Identify missing wardrobe items and recommend relevant clothing or accessories.

Potential capabilities:
- Identify gaps in the user's wardrobe.
- Search for complementary clothing.
- Recommend products within a specified budget.
- Provide product links.
- Allow users to approve shopping recommendations before proceeding.

## 4. Human-in-the-Loop and Security

Introduce explicit approval boundaries for actions that modify user data or interact with external services.

Examples:
- Confirm before deleting wardrobe items.
- Confirm before purchasing recommended products.
- Confirm before modifying calendar events.
- Allow users to review and edit generated outfit plans.

Additional security considerations:
- Replace local-storage-based authentication with secure authentication and session management.
- Implement OAuth2-based integrations where applicable.
- Apply least-privilege access to tools and external integrations.
- Protect against prompt injection and malicious tool outputs.
- Prevent unauthorized access to another user's wardrobe.
- Securely manage API credentials and secrets.
- Implement rate limiting and usage quotas.
- Validate tool inputs and outputs.

## 5. Observability and Evaluation

### 5.1 Distributed Tracing
Introduce OpenTelemetry instrumentation across the application.

Capture traces for:
- Incoming API requests.
- Agent execution.
- LLM invocations.
- MCP tool calls.
- Database queries.
- Vector searches.
- External API calls.
- Background job execution.
- Inter-agent communication.

### 5.2 Metrics and Monitoring
Track application and agent-specific metrics.

Potential metrics:
- API latency and error rates.
- Image processing duration.
- Queue depth and processing throughput.
- Agent execution duration.
- LLM token consumption and cost.
- Tool invocation success rate.
- Retry and failure rates.
- Workflow completion rate.

### 5.3 Agent Evaluation
Build an evaluation framework to measure the quality and reliability of agent execution.

Potential evaluation dimensions:
- Task completion rate.
- Tool selection accuracy.
- Tool argument accuracy.
- Outfit recommendation relevance.
- Constraint satisfaction.
- Hallucination rate.
- Execution efficiency.
- Latency and token consumption.

Maintain a benchmark dataset of representative user queries and expected outcomes to evaluate changes across agent implementations.

## 6. AWS & Cloud Infrastructure

Gradually migrate the application towards an AWS-based deployment architecture.

Potential AWS services:

| Component | AWS Service | Purpose |
|---|---|---|
| LLM inference | Amazon Bedrock | Foundation model access |
| Agent execution | Amazon Bedrock AgentCore Runtime | Managed agent execution |
| Agent tools | Amazon Bedrock AgentCore Gateway | Tool and MCP integration |
| Agent memory | Amazon Bedrock AgentCore Memory | Persistent agent memory |
| Image storage | Amazon S3 | Original and processed images |
| Application state | Amazon DynamoDB | Workflow and application state |
| Vector retrieval | Amazon OpenSearch | Semantic retrieval |
| Background processing | Amazon SQS | Asynchronous task processing |
| Event routing | Amazon EventBridge | Event-driven communication |
| Serverless workers | AWS Lambda | Background processing |
| Containerized workloads | Amazon ECS | Backend and worker deployment |
| Observability | Amazon CloudWatch | Logs, metrics, and monitoring |
| Access management | AWS IAM | Service-level permissions |

The architecture should use managed services where they provide meaningful benefits while keeping application-level orchestration, business logic, and agent behaviour independently implemented.

## 7. CI/CD and Engineering Practices

- Introduce automated testing for APIs, agents, tools, and background workers.
- Add integration and end-to-end testing.
- Implement CI/CD pipelines using GitHub Actions.
- Introduce infrastructure as code.
- Containerize application components.
- Implement dependency and vulnerability scanning.
- Maintain separate development, staging, and production environments.
- Establish automated deployment and rollback mechanisms.

---

## Architectural Principles

The evolution of FitDecide will follow these principles:

1. **Agent autonomy with boundaries:** Agents should be capable of planning and executing tasks while operating within explicitly defined permissions.
2. **Separation of concerns:** Agent reasoning, business logic, data access, and external integrations should remain independently maintainable.
3. **Asynchronous by design:** Operations that involve expensive or long-running processing should not unnecessarily block API requests.
4. **Resilience over assumptions:** External services, LLMs, and background workers are expected to fail; the system should recover gracefully.
5. **Observable execution:** Every significant agent and distributed-system operation should be traceable and measurable.
6. **Evaluation-driven development:** Agent changes should be validated against measurable quality and reliability criteria.
7. **Human control:** Consequential actions should require explicit user approval.

## Long-Term Vision

FitDecide aims to demonstrate how an AI-powered consumer application can evolve into a reliable, distributed, agentic system.

Beyond generating outfit recommendations, the objective is to build a personal styling assistant capable of understanding context, planning multi-step workflows, interacting with external systems, remembering user preferences, and executing tasks with appropriate levels of autonomy.