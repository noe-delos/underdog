/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@iconify/react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import {
  Agent,
  Product,
  CallType,
  HistoriqueRelation,
} from "@/lib/types/database";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";

interface SimulationConfig {
  agent: Agent | null;
  product: Product | null;
  callType: CallType | null;
  goal: string;
  context: {
    secteur: string;
    company: string;
    historique_relation: HistoriqueRelation;
  };
}

const callTypes = [
  {
    id: "cold_call" as CallType,
    title: "🔍 Cold call",
    objective: "Schedule an appointment",
    criteria: "Meeting confirmed with date/time",
  },
  {
    id: "discovery_meeting" as CallType,
    title: "📅 Discovery meeting",
    objective: "Qualify needs and budget",
    criteria: "Budget confirmed + needs qualified",
  },
  {
    id: "product_demo" as CallType,
    title: "💻 Product demo",
    objective: "Convince with personalized proposal",
    criteria: "Interest confirmed + next step defined",
  },
  {
    id: "closing_call" as CallType,
    title: "✅ Closing call",
    objective: "Sign the contract",
    criteria: "Verbal agreement or signature",
  },
  {
    id: "follow_up_call" as CallType,
    title: "🔄 Follow-up call",
    objective: "Follow up after quote/proposal",
    criteria: "Objections handled + new timeline",
  },
];

const historiqueOptions: HistoriqueRelation[] = [
  "Premier contact",
  "2ème appel",
  "Relance post-devis",
];

export function SimulationStepper() {
  const [currentStep, setCurrentStep] = useState(1);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingSimulation, setStartingSimulation] = useState(false);
  const [config, setConfig] = useState<SimulationConfig>({
    agent: null,
    product: null,
    callType: null,
    goal: "",
    context: {
      secteur: "",
      company: "",
      historique_relation: "Premier contact",
    },
  });

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  // Load saved config when agent is selected
  useEffect(() => {
    if (config.agent?.id) {
      loadSavedConfig(config.agent.id);
    }
  }, [config.agent?.id]);

  const loadSavedConfig = (agentId: string) => {
    try {
      const savedConfig = localStorage.getItem(`agent_config_${agentId}`);
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig((prevConfig) => ({
          ...prevConfig,
          goal: parsedConfig.goal || "",
          context: {
            ...prevConfig.context,
            secteur: parsedConfig.context?.secteur || "",
            company: parsedConfig.context?.company || "",
            historique_relation:
              parsedConfig.context?.historique_relation || "First contact",
          },
        }));
      }
    } catch (error) {
      console.error("Error loading saved config:", error);
    }
  };

  const saveConfig = (agentId: string, configToSave: any) => {
    try {
      const currentSaved = localStorage.getItem(`agent_config_${agentId}`);
      const existingConfig = currentSaved ? JSON.parse(currentSaved) : {};

      const updatedConfig = {
        ...existingConfig,
        ...configToSave,
        context: {
          ...existingConfig.context,
          ...configToSave.context,
        },
      };

      localStorage.setItem(
        `agent_config_${agentId}`,
        JSON.stringify(updatedConfig)
      );
    } catch (error) {
      console.error("Error saving config:", error);
    }
  };

  const loadData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté");
        return;
      }

      const [agentsResponse, productsResponse] = await Promise.all([
        supabase
          .from("agents")
          .select("*")
          .or(`user_id.eq.${user.id},user_id.is.null`)
          .order("created_at", { ascending: false }),
        supabase
          .from("products")
          .select("*")
          .or(`user_id.eq.${user.id},user_id.is.null`)
          .order("created_at", { ascending: false }),
      ]);

      setAgents(agentsResponse.data || []);
      setProducts(productsResponse.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return config.agent !== null;
      case 2:
        return config.product !== null;
      case 3:
        return config.callType !== null;
      case 4:
        return (
          config.goal.trim() !== "" &&
          config.context.secteur.trim() !== "" &&
          config.context.company.trim() !== ""
        );
      default:
        return false;
    }
  };

  const startSimulation = async () => {
    if (!canProceed()) return;

    try {
      setStartingSimulation(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté");
        return;
      }

      // Create conversation record
      const { data: conversation, error } = await supabase
        .from("conversations")
        .insert({
          user_id: user.id,
          agent_id: config.agent!.id,
          product_id: config.product!.id,
          goal: config.goal,
          context: config.context,
          call_type: config.callType,
        })
        .select()
        .single();

      if (error) throw error;

      // Navigate to simulation
      router.push(`/simulation/${conversation.id}`);
    } catch (error) {
      console.error("Error starting simulation:", error);
      toast.error("Erreur lors du démarrage de la simulation");
    } finally {
      setStartingSimulation(false);
    }
  };

  const stepVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-12 w-full min-w-[500px]" />
        <div className="space-y-6">
          <Skeleton className="h-8 w-full min-w-[400px]" />
          <div className="grid grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full min-w-[250px]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-0">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center pl-0 ml-0">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep
                  ? "bg-[#021945] text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {step}
            </div>
            {step < 4 && (
              <div
                className={`w-14 h-0.5 ${
                  step < currentStep ? "bg-[#021945]" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card className="min-h-[500px] shadow-soft">
        <CardHeader>
          <CardTitle>
            {currentStep === 1 && "Choose your prospect"}
            {currentStep === 2 && "Select the product"}
            {currentStep === 3 && "Call type"}
            {currentStep === 4 && "Context and objective"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <AnimatePresence mode="wait" custom={currentStep}>
            <motion.div
              key={currentStep}
              custom={currentStep}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
            >
              {/* Step 1: Choose Agent */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Select the prospect you want to practice with
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {agents.map((agent) => (
                      <motion.div
                        key={agent.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all ${
                            config.agent?.id === agent.id
                              ? "ring-2 ring-[#021945] bg-blue-50"
                              : "hover:shadow-md"
                          } shadow-soft`}
                          onClick={() => setConfig({ ...config, agent })}
                        >
                          <CardContent className="p-4 py-0">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden flex-shrink-0">
                                <img
                                  src={
                                    agent.picture_url || "/default-avatar.png"
                                  }
                                  alt={agent.name || "Agent"}
                                  className="w-full h-full object-cover object-top"
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold">
                                  {agent.firstname && agent.lastname
                                    ? `${agent.firstname} ${agent.lastname}`
                                    : agent.name}
                                </h3>
                                <p className="text-sm text-muted-foreground truncate max-w-[10rem]">
                                  {agent.job_title}
                                </p>
                                <Badge variant="outline" className="mt-1">
                                  {agent.difficulty}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Choose Product */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Choose the product you will present
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {products.map((product) => (
                      <motion.div
                        key={product.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all ${
                            config.product?.id === product.id
                              ? "ring-2 ring-[#021945] bg-blue-50"
                              : "hover:shadow-md"
                          } shadow-soft`}
                          onClick={() => setConfig({ ...config, product })}
                        >
                          <CardContent className="p-4 py-0">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Icon
                                  icon="material-symbols:package-2"
                                  className="h-5 w-5 text-[#021945]"
                                />
                                <h3 className="font-semibold">
                                  {product.name}
                                </h3>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {product.pitch}
                              </p>
                              <div className="flex items-center justify-between">
                                <Badge variant="outline">
                                  {product.marche}
                                </Badge>
                                {product.price && (
                                  <span className="text-sm font-semibold text-green-600">
                                    {product.price}€
                                  </span>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Choose Call Type */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Define your training objective
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {callTypes.map((callType) => (
                      <motion.div
                        key={callType.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all ${
                            config.callType === callType.id
                              ? "ring-2 ring-[#021945] bg-blue-50"
                              : "hover:shadow-md"
                          } shadow-soft`}
                          onClick={() =>
                            setConfig({ ...config, callType: callType.id })
                          }
                        >
                          <CardContent className="p-4 py-0">
                            <div className="space-y-2">
                              <h3 className="font-semibold text-lg">
                                {callType.title}
                              </h3>
                              <p className="text-sm">
                                <strong>Objective:</strong> {callType.objective}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                <strong>Success Criteria:</strong>{" "}
                                {callType.criteria}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Context and Goal */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Call context</h3>
                      <div>
                        <Label htmlFor="secteur">Industry sector</Label>
                        <Input
                          id="secteur"
                          placeholder="Ex: E-commerce, SaaS, Finance..."
                          value={config.context.secteur}
                          onChange={(e) => {
                            const newConfig = {
                              ...config,
                              context: {
                                ...config.context,
                                secteur: e.target.value,
                              },
                            };
                            setConfig(newConfig);
                            // Save to localStorage
                            if (config.agent?.id) {
                              saveConfig(config.agent.id, {
                                context: {
                                  ...config.context,
                                  secteur: e.target.value,
                                },
                              });
                            }
                          }}
                          className="shadow-soft mt-3 placeholder:text-foreground/20"
                        />
                      </div>
                      <div>
                        <Label htmlFor="company">Company name</Label>
                        <Input
                          id="company"
                          placeholder="Ex: TechCorp, StartupXYZ..."
                          value={config.context.company}
                          onChange={(e) => {
                            const newConfig = {
                              ...config,
                              context: {
                                ...config.context,
                                company: e.target.value,
                              },
                            };
                            setConfig(newConfig);
                            // Save to localStorage
                            if (config.agent?.id) {
                              saveConfig(config.agent.id, {
                                context: {
                                  ...config.context,
                                  company: e.target.value,
                                },
                              });
                            }
                          }}
                          className="shadow-soft mt-3 placeholder:text-foreground/20"
                        />
                      </div>
                      <div>
                        <Label htmlFor="historique">Relationship history</Label>
                        <select
                          className="w-full p-2 border rounded-md shadow-soft mt-3"
                          value={config.context.historique_relation}
                          onChange={(e) => {
                            const newConfig = {
                              ...config,
                              context: {
                                ...config.context,
                                historique_relation: e.target
                                  .value as HistoriqueRelation,
                              },
                            };
                            setConfig(newConfig);
                            // Save to localStorage
                            if (config.agent?.id) {
                              saveConfig(config.agent.id, {
                                context: {
                                  ...config.context,
                                  historique_relation: e.target
                                    .value as HistoriqueRelation,
                                },
                              });
                            }
                          }}
                        >
                          {historiqueOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-semibold">Personal objective</h3>
                      <div>
                        <Label htmlFor="goal">
                          Describe your objective for this call
                        </Label>
                        <Textarea
                          id="goal"
                          placeholder="Ex: Convince the prospect of the value of our CRM solution and get a demo appointment..."
                          value={config.goal}
                          onChange={(e) => {
                            const newConfig = {
                              ...config,
                              goal: e.target.value,
                            };
                            setConfig(newConfig);
                            // Save to localStorage
                            if (config.agent?.id) {
                              saveConfig(config.agent.id, {
                                goal: e.target.value,
                              });
                            }
                          }}
                          rows={6}
                          className="shadow-soft resize-none mt-3 placeholder:text-foreground/20 min-h-[10rem]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-4">
                      Your training summary
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card className="pt-4 shadow-soft">
                        <CardContent className="p-4 py-0">
                          <h4 className="font-medium mb-2">Prospect</h4>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden flex-shrink-0">
                              <img
                                src={
                                  config.agent?.picture_url ||
                                  "/default-avatar.png"
                                }
                                alt={config.agent?.name || "Agent"}
                                className="w-full h-full object-cover object-top"
                              />
                            </div>

                            <div>
                              <p className="text-sm font-medium">
                                {config.agent?.firstname &&
                                config.agent?.lastname
                                  ? `${config.agent.firstname} ${config.agent.lastname}`
                                  : config.agent?.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {config.agent?.job_title}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="py-4 shadow-soft">
                        <CardContent className="p-4 py-0">
                          <h4 className="font-medium mb-2">Product</h4>
                          <p className="text-sm font-medium">
                            {config.product?.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {config.product?.marche}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="pt-0 shadow-soft">
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">Call type</h4>
                          <p className="text-sm">
                            {
                              callTypes.find((ct) => ct.id === config.callType)
                                ?.title
                            }
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {currentStep < 4 ? (
          <Button onClick={nextStep} disabled={!canProceed()}>
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={startSimulation}
            disabled={!canProceed() || startingSimulation}
            className="bg-[#021945] hover:bg-[#0A2E4B] cursor-pointer"
          >
            {startingSimulation ? (
              <Icon icon="mdi:loading" className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            {startingSimulation ? "Starting..." : "Start training"}
          </Button>
        )}
      </div>
    </div>
  );
}
